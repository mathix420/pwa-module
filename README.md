# *Better maintained* PWA Module

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]
[![Checks][checks-src]][checks-href]
[![Codecov][codecov-src]][codecov-href]

> Zero config PWA solution for Nuxt.js

📖 [**Read Documentation**](https://pwa-module.vercel.app)

## Installation

```bash
npm i -D @plsr/pwa
```

```bash
yarn add -D @plsr/pwa
```

## Aditional features

- Use of [`pwa-asset-generator`](https://github.com/elegantapp/pwa-asset-generator#readme) to generate better PWA assets.
- Up to date `workbox-cli` via the [`workbox-lib`](https://github.com/nuxt-community/workbox-cdn#readme) library.

## Config Example

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
    manifest: {
      lang: 'en',
      name: 'Peach',
      short_name: 'Peach',
      display: 'standalone',
      theme_color: '#0d0d0d',
      background_color: '#0d0d0d',
      description: 'desc',
      categories: ['entertainment', 'social', 'personalization'],
      screenshots: [
        {
          src: '/_pwa/screenshots/rev1/screenshot-0.jpg',
          sizes: '540x1061',
          type: 'image/jpg',
        },
        {
          src: '/_pwa/screenshots/rev1/screenshot-1.jpg',
          sizes: '540x1061',
          type: 'image/jpg',
        },
        {
          src: '/_pwa/screenshots/rev1/screenshot-2.jpg',
          sizes: '540x1061',
          type: 'image/jpg',
        },
        {
          src: '/_pwa/screenshots/rev1/screenshot-3.jpg',
          sizes: '540x1061',
          type: 'image/jpg',
        },
        {
          src: '/_pwa/screenshots/rev1/screenshot-4.jpg',
          sizes: '540x1061',
          type: 'image/jpg',
        },
      ],
      shortcuts: [
        {
          name: 'Discover',
          url: '/discover?utm_source=jumplist&utm_medium=shortcut',
          icons: [
            {
              src: '/_pwa/shortcuts/rev1/discover.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
          description: 'Discover new videos',
        },
        {
          name: 'My Subs',
          url: '/my-subs?utm_source=jumplist&utm_medium=shortcut',
          icons: [
            {
              src: '/_pwa/shortcuts/rev1/my-subs.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
          description: "Your subscriptions' latest videos",
        },
        {
          name: 'Trendings',
          url: '/trendings?utm_source=jumplist&utm_medium=shortcut',
          icons: [
            {
              src: '/_pwa/shortcuts/rev1/trendings.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
          description: 'Daily trendings',
        },
        {
          name: 'Saved Videos',
          url: '/saved-videos?utm_source=jumplist&utm_medium=shortcut',
          icons: [
            {
              src: '/_pwa/shortcuts/rev1/saved-videos.png',
              sizes: '192x192',
              type: 'image/png',
            },
          ],
          description: 'Your saved videos',
        },
      ],
    },
    meta: {
      lang: 'en',
      name: 'Peach',
      favicon: false,
      mobileAppIOS: true,
      theme_color: '#0d0d0d',
    },
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

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) - Nuxt Community

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/v/@plsr/pwa/latest.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@plsr/pwa

[npm-downloads-src]: https://img.shields.io/npm/dm/@plsr/pwa.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@plsr/pwa

[checks-src]: https://flat.badgen.net/github/checks/mathix420/pwa-module/dev
[checks-href]: https://github.com/mathix420/pwa-module/actions

[codecov-src]: https://img.shields.io/codecov/c/github/mathix420/pwa-module.svg?style=flat-square
[codecov-href]: https://codecov.io/gh/mathix420/pwa-module
