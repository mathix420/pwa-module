import { join, resolve } from 'path'
import fs from 'fs-extra'
import hasha from 'hasha'
import pwaAssetGenerator from 'pwa-asset-generator'
import type { PWAContext, IconOptions } from '../types'
import { joinUrl, getRouteParams, emitAsset, PKG_DIR } from './utils'

export async function icon (nuxt, pwa: PWAContext, moduleContainer) {
  const { publicPath } = getRouteParams(nuxt.options)

  // Defaults
  const defaults: IconOptions = {
    assetsGenerator: [
      {
        scrape: false,
        background: 'white',
        portraitOnly: true,
        log: false,
        quality: 90
      }
    ],

    fileName: 'icon.png',
    source: null,
    purpose: ['any', 'maskable'],
    cacheDir: join(nuxt.options.rootDir, 'node_modules/.cache/pwa/icon'),

    targetDir: 'icons',

    plugin: true,
    pluginName: '$icon',

    publicPath,

    // @ts-ignore
    _iconHash: null,
    _metaLinks: null,
    _assets: null,
    _manifestIcons: null,
    _iosSplash: null
  }

  // Merge options
  const options: IconOptions = {
    ...defaults,
    ...pwa.icon
  }

  // Find source
  options.source = await findIcon(nuxt, options)

  // Disable module if no icon specified
  if (!options.source) {
    // eslint-disable-next-line no-console
    console.warn('[pwa] [icon] Icon not found in ' + resolve(nuxt.options.srcDir, nuxt.options.dir.static, options.fileName))
    return
  }

  // Verify purpose
  if (options.purpose) {
    if (!Array.isArray(options.purpose)) {
      options.purpose = [options.purpose]
    }
    const validPurpose = ['badge', 'maskable', 'any']
    if (options.purpose.find(p => !validPurpose.includes(p))) {
      // eslint-disable-next-line no-console
      console.warn('[pwa] [icon] Some invalid items removed from `options.purpose`. Valid values: ' + validPurpose)
    }
  }

  // Generate icons
  await generateIcons(nuxt, options)

  // Add manifest
  addManifest(nuxt, options, pwa)

  // Add plugin
  if (options.plugin) {
    addPlugin(nuxt, options, moduleContainer)
  }

  // Emit assets in background
  emitAssets(nuxt, options)
}

function findIcon (nuxt, options) {
  const iconSearchPath = [
    options.source,
    resolve(nuxt.options.srcDir, nuxt.options.dir.static, options.fileName),
    resolve(nuxt.options.srcDir, nuxt.options.dir.assets, options.fileName)
  ].filter(p => p)

  for (const source of iconSearchPath) {
    if (fs.existsSync(source)) {
      return source
    }
  }
}

function addPlugin (_nuxt, options, moduleContainer) {
  const icons = {}
  for (const asset of options._assets) {
    icons[asset.name] = joinUrl(options.publicPath, asset.target)
  }

  if (options.plugin) {
    moduleContainer.addPlugin({
      src: resolve(PKG_DIR, 'templates/icon.plugin.js'),
      fileName: 'pwa/icon.plugin.js',
      options: {
        pluginName: options.pluginName,
        icons
      }
    })
  }
}

async function generateIcons (_nuxt, options) {
  // Get hash of source icon
  if (!options.iconHash) {
    options.iconHash = await hasha.fromFile(options.source)
  }

  const configHash = hasha(JSON.stringify({
    ...options.assetsGenerator,
    iconHash: options.iconHash
  })).substring(0, 6)

  options._manifestIcons = []
  options._metaLinks = []
  options._assets = []

  // TODO: check if hash exists
  const cacheFile = `${options.cacheDir}/.${configHash}`
  if (fs.existsSync(cacheFile)) {
    const res = fs.readFileSync(cacheFile, { encoding: 'utf-8', flag: 'r' })
    const j = JSON.parse(res)
    options._manifestIcons = j.manifestIcons
    options._metaLinks = j.metaLinks
    options._assets = j.assets
    return
  }

  // Clean cache folder
  await fs.remove(options.cacheDir)
  await fs.mkdirp(options.cacheDir)

  for (const config of options.assetsGenerator) {
    // Generate spash and icons
    const res = await pwaAssetGenerator.generateImages(
      options.source,
      options.cacheDir,
      {
        ...config,
        pathOverride: options.targetDir
      }
    )

    const pwaHead = {
      link: [],
      meta: []
    }

    // Map all meta generated
    for (const [, meta] of Object.entries(res.htmlMeta)) {
      const trimmedMeta = (meta as string).trim()
      const type = trimmedMeta.match(/^<(\w+)\s/)[1]
      pwaHead[type].push(
        // Convert HTML tags back into Objects
        ...trimmedMeta.split('\n').map(line => Object.fromEntries(
          Array.from(line.matchAll(/\s(\w+)="([^"]+)"/g))
            .map(([, key, value]) => [key, value])
        ))
      )
    }

    // For now, ignore meta tags
    delete pwaHead.meta

    options._metaLinks.push(...pwaHead.link.map((link, id) => {
      const splittedHref = link.href.split('.')
      const target = splittedHref.slice(0, splittedHref.length - 1)
        .concat([configHash])
        .concat(splittedHref.slice(splittedHref.length - 1))
        .join('.')
      return {
        ...link,
        hid: `${link.rel}-pwa-gen-${id}`,
        href: joinUrl(options.publicPath, target)
      }
    }))

    options._manifestIcons.push(...res.manifestJsonContent.map((entry) => {
      const splittedSrc = entry.src.split('.')
      const target = splittedSrc.slice(0, splittedSrc.length - 1)
        .concat([configHash])
        .concat(splittedSrc.slice(splittedSrc.length - 1))
        .join('.')
      return {
        ...entry,
        src: joinUrl(options.publicPath, target)
      }
    }))

    // Icons to be emited by webpack
    options._assets.push(...res.savedImages.map((image) => {
      const splittedPath = image.path.split('/')
      const splittedSrc = splittedPath[splittedPath.length - 1].split('.')
      const target = splittedSrc.slice(0, splittedSrc.length - 1)
        .concat([configHash])
        .concat(splittedSrc.slice(splittedSrc.length - 1))
        .join('.')
      return { cacheLocation: image.path, target: `${options.targetDir}/${target}` }
    }))
  }

  fs.writeFileSync(cacheFile, JSON.stringify({
    manifestIcons: options._manifestIcons,
    metaLinks: options._metaLinks,
    assets: options._assets
  }), { encoding: 'utf-8', flag: 'w+' })
}

function addManifest (_nuxt, options, pwa) {
  if (!pwa.manifest) {
    pwa.manifest = {}
  }

  if (!pwa.manifest.icons) {
    pwa.manifest.icons = []
  }
  pwa.manifest.icons.push(...options._manifestIcons)

  pwa._pwaMetas = {
    links: [
      ...options._metaLinks
    ]
  }
}

function emitAssets (nuxt, options) {
  for (const { cacheLocation, target } of options._assets) {
    emitAsset(nuxt, target, fs.readFile(cacheLocation))
  }
}
