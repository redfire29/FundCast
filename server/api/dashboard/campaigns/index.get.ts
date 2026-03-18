import { requireSupabaseUser } from '../../../utils/auth'
import { getSupabaseServerClient } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireSupabaseUser(event)
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase server client is not configured.'
    })
  }

  const { data, error } = await supabase
    .from('campaigns')
    .select('id, slug, overlay_token, name, headline, description, currency, goal_amount, status, embed_enabled, overlay_enabled, updated_at')
    .eq('owner_user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return {
    campaigns: data || []
  }
})
