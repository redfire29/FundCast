import type { SupabaseClient } from '@supabase/supabase-js'

export function useSupabaseClient(): SupabaseClient {
  const { $supabase } = useNuxtApp()

  if (!$supabase) {
    throw new Error('Supabase client is not available. Please set NUXT_PUBLIC_SUPABASE_URL and NUXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  return $supabase
}
