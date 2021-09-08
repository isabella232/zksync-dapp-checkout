// noinspection ES6PreferShortImport

import { NuxtConfig } from "@nuxt/types";
import { NuxtOptionsEnv } from "@nuxt/types/config/env";
import { MetaPropertyName } from "vue-meta/types/vue-meta";
import { ToastAction, ToastIconPack, ToastObject, ToastOptions, ToastPosition } from "vue-toasted";

import { CURRENT_APP_NAME, ETHER_NETWORK_CAPITALIZED, ETHER_PRODUCTION, ONBOARD_APP_LOGO, ONBOARD_FORTMATIC_SITE_VERIFICATION_META, ZK_DAPP_URL } from "./src/plugins/build";

// @ts-ignore
import * as zkTailwindDefault from "matter-zk-ui/tailwind.config.js";
import { Configuration } from "webpack";

const srcDir = "./src/";

const env = process.env.APP_ENV ?? "dev";
const isProduction: boolean = ETHER_PRODUCTION && env === "prod";
const pageTitle: string = CURRENT_APP_NAME.toString() ?? "zkSync Wallet";
const pageImg = `${ZK_DAPP_URL}/cover.jpg`;

const pageTitleTemplate = ETHER_PRODUCTION ? CURRENT_APP_NAME : `${ETHER_NETWORK_CAPITALIZED}`;

const pageDescription = process.env.SITE_DESCRIPTION ?? "";
const pageKeywords = process.env.SITE_KEYWORDS ?? "";

const fortmaticMeta: MetaPropertyName[] = [];
if (isProduction && ONBOARD_FORTMATIC_SITE_VERIFICATION_META) {
  fortmaticMeta.push({
    name: "fortmatic-site-verification",
    content: ONBOARD_FORTMATIC_SITE_VERIFICATION_META,
  });
}

const config: NuxtConfig = {
  components: ["@/components/", { path: "@/blocks/", prefix: "block" }],
  telemetry: false,
  ssr: false,
  target: "static",
  srcDir: `${srcDir}`,
  vue: {
    config: {
      productionTip: isProduction,
      devtools: !isProduction,
    },
  },
  env: <NuxtOptionsEnv>{
    ...process.env,
  },

  /**
   * Head-placed HTML-tags / configuration of the `<meta>`
   */
  head: {
    title: pageTitle as string | undefined,
    titleTemplate: `%s | ${pageTitleTemplate}`,
    htmlAttrs: {
      lang: "en",
      amp: "true",
    },
    meta: [
      /**
       * Fortmatic
       */
      ...fortmaticMeta,
      /**


       * Cache-control
       */
      {
        property: "cache-control",
        httpEquiv: "cache-control",
        content: "no-cache , no-store, must-revalidate",
      },
      {
        httpEquiv: "pragma",
        content: "no-cache",
        property: "pragma",
      },
      {
        httpEquiv: "cache-control",
        property: "cache-control",
        content: "no-cache , no-store, must-revalidate",
      },
      {
        property: "expires",
        httpEquiv: "expires",
        content: "0",
      },

      /**
       * UX / UI settings
       */
      { charset: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, minimum-scale=1.0, maximum-scale=1.0" },

      /**
       * Page meta:
       * - SEO tags (keywords, description, author)
       * - OpenGraph tags (thumbnail,
       */
      {
        hid: "keywords",
        name: "keywords",
        content: pageKeywords,
      },
      {
        hid: "description",
        name: "description",
        content: pageDescription,
      },
      {
        hid: "author",
        name: "author",
        content: "https://matter-labs.io",
      },
      {
        hid: "twitter:title",
        name: "twitter:title",
        content: pageTitle,
      },
      {
        hid: "twitter:description",
        name: "twitter:description",
        content: pageDescription,
      },
      {
        hid: "twitter:image",
        name: "twitter:image",
        content: pageImg,
      },
      {
        hid: "twitter:site",
        name: "twitter:site",
        content: "@zksync",
      },
      {
        hid: "twitter:creator",
        name: "twitter:creator",
        content: "@the_matter_labs",
      },
      {
        hid: "twitter:image:alt",
        name: "twitter:image:alt",
        content: pageTitle,
      },
      {
        hid: "og:title",
        property: "og:title",
        content: pageTitle,
      },
      {
        hid: "og:description",
        property: "og:description",
        content: pageDescription,
      },
      {
        hid: "og:image",
        property: "og:image",
        content: pageImg,
      },
      {
        hid: "og:image:secure_url",
        property: "og:image:secure_url",
        content: pageImg,
      },
      {
        hid: "og:image:alt",
        property: "og:image:alt",
        content: pageTitle,
      },
      {
        hid: "msapplication-TileImage",
        name: "msapplication-TileImage",
        content: ONBOARD_APP_LOGO,
      },
      { hid: "theme-color", name: "theme-color", content: "#4e529a" },
      {
        hid: "msapplication-TileColor",
        property: "msapplication-TileColor",
        content: "#4e529a",
      },
    ],
    link: [{ rel: "icon", type: "image/x-icon", href: "/favicon-dark.png" }],
  },

  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: "#8c8dfc",
    continuous: true,
  },

  /**
   * Single-entry global-scope scss
   */
  css: ["@/assets/style/main.scss"],

  styleResources: {
    scss: ["@/assets/style/vars/*.scss"],
  },

  /**
   * Plugins that should be loaded before the mounting
   */
  plugins: ["@/plugins/main", "@/plugins/setCheckoutData"],

  router: {
    middleware: ["auth"],
  },
  /**
   * Nuxt.js dev-modules
   */
  buildModules: [
    "nuxt-typed-vuex",
    "nuxt-build-optimisations",
    "@nuxtjs/style-resources",
    "@nuxtjs/tailwindcss",
    [
      "@nuxt/typescript-build",
      {
        typescript: {
          typeCheck: {
            async: true,
            stylelint: {
              config: [".stylelintrc"],
              files: "src/**.scss",
            },
            eslint: {
              config: [".eslintrc.js", "tsconfig-eslint.json"],
              files: "src/**/*.{ts,js,vue}",
            },
            files: "src/**/*.{ts,vue}",
          },
        },
      },
    ],
    "@nuxtjs/google-fonts",
    ["@nuxtjs/dotenv", { path: __dirname }],
    "matter-zk-ui",
  ],

  /**
   * Nuxt.js modules
   */
  modules: [
    [
      "nuxt-social-meta",
      {
        url: ZK_DAPP_URL,
        title: pageTitle,
        site_name: pageTitle,
        description: pageDescription,
        img: pageImg,
        img_size: { width: 2560, height: 1280 },
        locale: "en_US",
        twitter: "@zksync",
        twitter_card: pageImg,
        theme_color: "#4e529a",
      },
    ],
    "@nuxtjs/axios",
    "@nuxtjs/toast",
    "@nuxtjs/google-gtag",
  ],

  toast: <ToastOptions>{
    singleton: true,
    keepOnHover: true,
    position: "bottom-right" as ToastPosition,
    duration: 4000,
    className: "zkToastMain",
    iconPack: "fontawesome" as ToastIconPack,
    action: <ToastAction>{
      text: "OK",
      class: "zkToastActionClose",
      icon: "fa-times-circle",
      onClick: (_: unknown, toastObject: ToastObject) => {
        toastObject.goAway(100);
      },
    },
  },
  sentry: {
    dsn: process.env.SENTRY_DSN,
    disableServerSide: true,
    config: {
      tracesSampleRate: 1.0,
      environment: isProduction ? "production" : env === "dev" ? "development" : env,
    },
  },
  "google-gtag": {
    id: process.env.GTAG_ID,
    config: {
      anonymize_ip: true, // anonymize IP
      send_page_view: true, // might be necessary to avoid duplicated page track on page reload
    },
    debug: !isProduction, // enable to track in dev mode
    disableAutoPageTrack: false, // disable if you don't want to track each page route with router.afterEach(...).
  },

  tailwindcss: {
    config: {
      ...zkTailwindDefault,
      purge: {
        enabled: isProduction,
        content: [
          `${srcDir}/components/**/*.vue`,
          `${srcDir}/blocks/**/*.vue`,
          `${srcDir}/blocks/**/*.vue`,
          `${srcDir}/layouts/**/*.vue`,
          `${srcDir}/pages/**/*.vue`,
          `${srcDir}/plugins/**/*.{js,ts}`,
          "./node_modules/matter-zk-ui/components/**/*.vue",
          "./node_modules/matter-zk-ui/blocks/**/*.vue",
          "./node_modules/matter-zk-ui/blocks/**/*.vue",
          "./node_modules/matter-zk-ui/layouts/**/*.vue",
          "./node_modules/matter-zk-ui/pages/**/*.vue",
          "./node_modules/matter-zk-ui/plugins/**/*.{js,ts}",
          "./node_modules/matter-zk-ui/nuxt.config.{js,ts}",
        ],
      },
    },
  },

  /**
   * Build configuration
   */
  build: {
    babel: {
      compact: true,
    },
    hardSource: isProduction,
    ssr: false,
    extend(config: Configuration) {
      config.node = {};
    },
  },
  googleFonts: {
    prefetch: true,
    preconnect: true,
    preload: true,
    display: "swap",
    families: {
      "Fira+Sans": [300, 400, 500, 600],
      "Fira+Sans+Condensed": [200, 400, 500, 600],
      "Fira+Code": [300],
    },
  },
  generate: {
    dir: "public",
    fallback: "404.html",
    devtools: env !== "prod",
  },
};
export default config;