import { requireSupabaseUser } from '../../../utils/auth'
import { getSupabaseServerClient } from '../../../utils/supabase'

export default defineEventHandler(async (event) => {
  const user = await requireSupabaseUser(event)
  const campaignId = getRouterParam(event, 'id')

  if (!campaignId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Campaign id is required.'
    })
  }

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
    .eq('id', campaignId)
    .eq('owner_user_id', user.id)
    .single()

  if (error || !data) {
    throw createError({
      statusCode: error?.code === 'PGRST116' ? 404 : 500,
      statusMessage: error?.message || 'Unable to load campaign.'
    })
  }

  return {
    campaign: data
  }
})
