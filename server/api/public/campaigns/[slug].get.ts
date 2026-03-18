import { getCampaignBySlug } from '../../../utils/campaigns'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Campaign slug is required.'
    })
  }

  const campaign = await getCampaignBySlug(slug)

  if (!campaign) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Campaign not found.'
    })
  }

  return {
    campaign
  }
})
