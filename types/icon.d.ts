import { CLIOptions } from 'pwa-asset-generator/dist/models/options'
export type iOSType = 'ipad' | 'ipadpro9' | 'ipadpro9' | 'ipadpro10' | 'ipadpro12' | 'iphonese' | 'iphone6' | 'iphoneplus' | 'iphonex' | 'iphonexr' | 'iphonexsmax'
export type iOSSize = [number, number, iOSType]

export interface IconOptions {
  /**
   * Default: `[srcDir]/[staticDir]/icon.png`
   */
  source: string,
  /**
   * Default: `icon.png`
   */
  fileName: string,

  /**
   * Default:
   * ```javascript
   * {
   *  scrape: false,
   *  background: 'white',
   *  portraitOnly: true,
   *  log: false
   * }
   * ```
   */
  assetsGenerator: [CLIOptions],

  /**
   * Default: `icons`
   */
  targetDir: string,
  /**
   * Make icons accessible through `ctx` or Vue instances.
   *
   * Default: `true`
   */
  plugin: boolean,
  /**
   * Name of property for accessible icons.
   *
   * Default: `$icon`
   */
  pluginName: string,
  /**
   * Array or string of icon purpose.
   *
   * Default: `['any', 'maskable']`
   */
  purpose: string[] | string,
  /**
   * Cache dir for generated icons
   *
   * Default: `{rootDir}/node_modules/.cache/icon`
   */
  cacheDir: string,

  publicPath: string
}
