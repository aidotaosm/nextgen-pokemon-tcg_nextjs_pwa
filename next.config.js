const customRuntimeCaching = require("./public/customRuntimeCaching");
const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  //  disable: true,
  register: true,
  skipWaiting: true,
  runtimeCaching: [...customRuntimeCaching],
  fallbacks: {
    image: "/images/Cardback.webp",
  },
  maximumFileSizeToCacheInBytes: 50000000,
  reloadOnOnline: false,
  buildExcludes: [/media\/.*$/],
  publicExcludes: [
    "!noprecache/**/*",
    "!sitemap.xml",
    "!robots.txt",
    "!images/pokemon_tcg_base_image.webp",
    "!images/expansions_image.jpg",
    "!customRuntimeCaching.js",
    "!antd.min.css",
  ],
  //   publicExcludes: ['!manifest.webmanifest', '!images/favicon-16x16.png', '!images/favicon-32x32.png', '!images/safari-pinned-tab.svg', '!images/android-chrome-192x192.png', '!images/android-chrome-512x512.png', '!images/apple-touch-icon.png', '!favicon.ico']
});
module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.pokemontcg.io"],
    minimumCacheTTL: 60 * 60 * 24 * 30 * 12,
  },
  //  api: {
  //     responseLimit: false,
  // },
  staticPageGenerationTimeout: 1000,
  compiler: {
    removeConsole:
      process.env.APP_ENV !== "local" && process.env.NODE_ENV !== "development",
  },
  transpilePackages: [
    // antd & deps
    "@ant-design",
    "@rc-component",
    "antd",
    "rc-cascader",
    "rc-checkbox",
    "rc-collapse",
    "rc-dialog",
    "rc-drawer",
    "rc-dropdown",
    "rc-field-form",
    "rc-image",
    "rc-input",
    "rc-input-number",
    "rc-mentions",
    "rc-menu",
    "rc-motion",
    "rc-notification",
    "rc-pagination",
    "rc-picker",
    "rc-progress",
    "rc-rate",
    "rc-resize-observer",
    "rc-segmented",
    "rc-select",
    "rc-slider",
    "rc-steps",
    "rc-switch",
    "rc-table",
    "rc-tabs",
    "rc-textarea",
    "rc-tooltip",
    "rc-tree",
    "rc-tree-select",
    "rc-upload",
    "rc-util",
  ],
  // target: 'serverless'
});

// "CacheFirst"

// ,
// "CacheOnly"

// ,
// "NetworkFirst"

// ,
// "NetworkOnly"

// , or
// "StaleWhileRevalidate"
