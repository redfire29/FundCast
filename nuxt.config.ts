// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    supabaseUrl: '',
    supabaseServiceRoleKey: '',
    public: {
      appUrl: 'http://localhost:3000'
    }
  },
  nitro: {
    routeRules: {
      '/overlay/**': {
        cors: true
      },
      '/api/public/**': {
        cors: true
      }
    }
  }
})
