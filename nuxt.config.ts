// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/color-mode', '@nuxt/icon', '@nuxtjs/mdc'],
  colorMode: {
    classSuffix: ''
  },
  css: ['~/assets/css/global.css']
})