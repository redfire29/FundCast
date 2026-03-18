import { getCampaignByOverlayToken } from '../../../utils/campaigns'

export default defineEventHandler(async (event) => {
  const token = getRouterParam(event, 'token')

  if (!token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Overlay token is required.'
    })
  }

  const campaign = await getCampaignByOverlayToken(token)

  if (!campaign || !campaign.overlayEnabled) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Overlay not found.'
    })
  }

  return {
    campaign
  }
})
