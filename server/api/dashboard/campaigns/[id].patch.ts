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

  const body = await readBody<{
    name?: string
    goalAmount?: number
    description?: string
    status?: string
    overlayEnabled?: boolean
  }>(event)

  if (!body.name || !body.description || !body.goalAmount || !body.status) {
    throw createError({
      statusCode: 400,
      statusMessage: 'name, goalAmount, description, status are required.'
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
    .update({
      name: body.name,
      description: body.description,
      goal_amount: Math.round(body.goalAmount),
      status: body.status,
      overlay_enabled: body.overlayEnabled ?? true,
      updated_at: new Date().toISOString()
    })
    .eq('id', campaignId)
    .eq('owner_user_id', user.id)
    .select('id, slug, overlay_token, name, headline, description, currency, goal_amount, status, embed_enabled, overlay_enabled, updated_at')
    .single()

  if (error || !data) {
    throw createError({
      statusCode: error?.code === 'PGRST116' ? 404 : 500,
      statusMessage: error?.message || 'Unable to update campaign.'
    })
  }

  return {
    campaign: data
  }
})
