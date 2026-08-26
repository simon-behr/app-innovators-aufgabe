// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/ui', '@nuxt/eslint', '@nuxt/test-utils/module'],
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  compatibilityDate: '2025-07-15',
  typescript: {
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
