import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  if (!config.public.supabaseUrl || !config.public.supabaseAnonKey) {
    return {
      provide: {
        supabase: null
      }
    }
  }

  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey, {
    auth: import.meta.client
      ? {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true
        }
      : {
          persistSession: false,
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
  })

  return {
    provide: {
      supabase
    }
  }
})
