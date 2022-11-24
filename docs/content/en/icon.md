---
title: Icon Module
description: This module automatically generates app icons and favicon with different sizes
position: 2
category: Modules
---

This module automatically generates app icons and favicon with different sizes using [jimp](https://github.com/oliver-moran/jimp) and fills `manifest.icons[]` with proper paths to generated assets that is used by manifest module. Source icon is being resized using *cover* method.


You can pass options to `pwa.icon` in `nuxt.config.js` to override defaults.

```js{}[nuxt.config.js]
pwa: {
  icon: {
    /* icon options */
  }
}
```

## options

**source**
- Default: `[srcDir]/[staticDir]/icon.png`

**fileName**
- Default: `icon.png`

**sizes**
- Default: `[64, 120, 144, 152, 192, 384, 512]`

Array of sizes to be generated (Square).

**targetDir**
- Default: `icons`

**plugin**
- Default: `true`

Make icons accessible through `ctx` or Vue instances.

Example: `ctx.$icon(512)` will return the url for the icon with the size of `512px`.
Will return an empty string when no icon in the given size is available (eg. when the size is not in `sizes` array).

**pluginName**
- Default: `'$icon'`

Name of property for accessible icons.

**purpose**
- Default: `['any', 'maskable']`

Array or string of icon purpose.

Example:

```js
purpose: 'maskable'
```

More detail of "purpose": [https://w3c.github.io/manifest/#purpose-member](https://w3c.github.io/manifest/#purpose-member)


**cacheDir**
- Default: `{rootDir}/node_modules/.cache/pwa/icon`

Cache dir for generated icons

**assetsGenerator**
- Default:
    ```js
    [
      {
        scrape: false,
        background: 'white',
        portraitOnly: true,
        log: false,
        quality: 90
      }
    ]
    ```
- Type: `Array<pwaAssetGenerator.Options>`

Allowed values: [pwa-asset-generator/src/models/options.ts](https://github.com/elegantapp/pwa-asset-generator/blob/master/src/models/options.ts)


## example

```js{}[nuxt.config.js]
const baseIconConfig = {
  portraitOnly: true,
  noSandbox: true,
  scrape: false,
  quality: 90,
  log: false,
}

export default {
  pwa: {
    icon: {
      plugin: false,
      cacheDir: '.local-cache/icons',
      assetsGenerator: [
        // Spash iOS
        {
          ...baseIconConfig,
          scrape: true,
          splashOnly: true,
          padding: 'calc(50vh - 15vw) calc(50vw - 15vw)',
          background: '#0d0d0d',
          type: 'png',
        },
        // Non-maskables Icons
        {
          ...baseIconConfig,
          opaque: false,
          iconOnly: true,
          padding: '0px',
          background: 'transparent',
          maskable: false,
        },
        // Maskables Icons
        {
          ...baseIconConfig,
          opaque: true,
          iconOnly: true,
          padding: '10%',
          background: 'white',
          maskable: true,
        },
      ],
    },
  },
}
```