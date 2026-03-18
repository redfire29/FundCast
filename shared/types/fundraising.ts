export type DonationSource = 'youtube' | 'ecpay' | 'manual'

export type CampaignStatus = 'draft' | 'active' | 'paused' | 'completed'

export interface CampaignSummary {
  id: string
  slug: string
  overlayToken: string
  name: string
  headline: string
  description: string
  currency: string
  goalAmount: number
  currentAmount: number
  progressPercent: number
  youtubeAmount: number
  ecpayAmount: number
  donorCount: number
  status: CampaignStatus
  embedEnabled: boolean
  overlayEnabled: boolean
  updatedAt: string
}

export interface CampaignPreview extends CampaignSummary {
  heroNote: string
  recentDonors: Array<{
    id: string
    name: string
    amount: number
    source: DonationSource
    donatedAt: string
  }>
}
