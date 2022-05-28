/* eslint camelcase: 0 */

export type Category = 'books' | 'business' | 'education' | 'entertainment' | 'finance' | 'fitness' | 'food' | 'games' | 'government' | 'health' | 'kids' | 'lifestyle' | 'magazines' | 'medical' | 'music' | 'navigation' | 'news' | 'personalization' | 'photo' | 'politics' | 'productivity' | 'security' | 'shopping' | 'social' | 'sports' | 'travel' | 'utilities' | 'weather';
export type Platform = 'wide' | 'narrow' | 'android' | 'chromeos' | 'ios' | 'kaios' | 'macos' | 'windows' | 'xbox' | 'chrome_web_store' | 'play' | 'itunes' | 'microsoft-inbox' | 'microsoft-store';

export interface Shortcut {
  name: string,
  url: string,
  short_name?: string,
  description?: string,
  icons?: string[],
}

export interface Screenshot {
  label?: string,
  platform?: Platform,
  src: string,
  sizes: string,
  type: string,
}

export interface ManifestOptions {
  /**
   * Default: _npm_package_name_
   */
  name: string,
  /**
   * Default: _npm_package_name_
   */
  short_name: string,
  /**
   * Default: _npm_package_description_
   */
  description: string,
  /**
   *
   */
  icons: Record<string, any>[],
  /**
   * https://developer.mozilla.org/en-US/docs/Web/Manifest/screenshots
   */
  screenshots: Screenshot[],
  /**
   * https://developer.mozilla.org/en-US/docs/Web/Manifest/categories
   */
  categories: Category[],
  /**
   * https://developer.mozilla.org/en-US/docs/Web/Manifest/shortcuts
   */
  shortcuts: Shortcut[],
  /**
   * Default: `routerBase + '?standalone=true'`
   */
  start_url: string,
  /**
   * Default: `standalone`
   */
  display: string,
  /**
   * Default: `#ffffff`
   */
  background_color: string,
  /**
   * Default: undefined
   */
  theme_color: string,
  /**
   * Default: `ltr`
   */
  dir: 'ltr' | 'rtl',
  /**
   * Default: `en`
   */
  lang: string,
  /**
   * Default: `false`
   */
  useWebmanifestExtension: boolean,
  /**
   * Default: A combination of `routerBase` and `options.build.publicPath`
   */
  publicPath: string,

  fileName: string,
  crossorigin: boolean
}
