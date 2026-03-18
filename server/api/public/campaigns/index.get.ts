import { listCampaignPreviews } from '../../../utils/campaigns'

export default defineEventHandler(async () => {
  const campaigns = await listCampaignPreviews()

  return {
    campaigns
  }
})
