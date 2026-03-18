import type { H3Event } from 'h3'
import { getSupabaseServerClient } from './supabase'

export async function requireSupabaseUser(event: H3Event) {
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader?.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Missing authorization token.'
    })
  }

  const accessToken = authHeader.slice('Bearer '.length)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase server client is not configured.'
    })
  }

  const { data, error } = await supabase.auth.getUser(accessToken)

  if (error || !data.user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid or expired Supabase session.'
    })
  }

  return data.user
}
