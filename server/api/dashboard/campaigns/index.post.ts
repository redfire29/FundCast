import { randomBytes } from 'node:crypto'
import slugify from 'slugify'
import { requireSupabaseUser } from '../../../utils/auth'
import { getSupabaseServerClient } from '../../../utils/supabase'

function makeOverlayToken() {
  return `ovl_${randomBytes(8).toString('hex')}`
}

function makeSlug(name: string) {
  const base = slugify(name, { lower: true, strict: true, trim: true }) || 'campaign'
  return `${base}-${randomBytes(3).toString('hex')}`
}

export default defineEventHandler(async (event) => {
  const user = await requireSupabaseUser(event)
  const body = await readBody<{
    name?: string
    headline?: string
    description?: string
    goalAmount?: number
    currency?: string
  }>(event)

  if (!body.name || !body.headline || !body.description || !body.goalAmount) {
    throw createError({
      statusCode: 400,
      statusMessage: 'name, headline, description, and goalAmount are required.'
    })
  }

  const supabase = getSupabaseServerClient()

  if (!supabase) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Supabase server client is not configured.'
    })
  }

  const payload = {
    owner_user_id: user.id,
    slug: makeSlug(body.name),
    overlay_token: makeOverlayToken(),
    name: body.name,
    headline: body.headline,
    description: body.description,
    goal_amount: Math.round(body.goalAmount),
    currency: body.currency || 'TWD',
    status: 'active',
    embed_enabled: true,
    overlay_enabled: true
  }

  const { data, error } = await supabase
    .from('campaigns')
    .insert(payload)
    .select('id, slug, overlay_token, name, headline, description, currency, goal_amount, status, embed_enabled, overlay_enabled, updated_at')
    .single()

  if (error) {
    throw createError({
      statusCode: 500,
      statusMessage: error.message
    })
  }

  return {
    campaign: data
  }
})
