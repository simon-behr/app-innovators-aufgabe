// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils/module'],
  devtools: { enabled: true },
  app: {
    head: {
      title: 'Produkt Katalog',
      meta: [
        { charset: 'utf8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
    },
  },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  typescript: {
    typeCheck: true,
    strict: true,
    tsConfig: {
      include: [
        '../test/unit/**/*',
      ],
    },
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
