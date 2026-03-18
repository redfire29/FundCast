import type { DonationSource, CampaignPreview, CampaignSummary } from '~~/shared/types/fundraising'
import { mockCampaigns } from './mock-data'
import { getSupabaseServerClient } from './supabase'

interface DonationEventRow {
  id: string
  donor_name: string | null
  amount_twd: number
  source: DonationSource
  donated_at: string
}

interface CampaignRow {
  id: string
  slug: string
  overlay_token: string
  name: string
  headline: string
  description: string
  currency: string
  goal_amount: number
  status: CampaignSummary['status']
  embed_enabled: boolean
  overlay_enabled: boolean
  updated_at: string
}

function toCampaignPreview(campaign: CampaignRow, donations: DonationEventRow[]): CampaignPreview {
  const confirmedDonations = donations.filter((donation) => donation.amount_twd > 0)
  const currentAmount = confirmedDonations.reduce((sum, donation) => sum + donation.amount_twd, 0)
  const youtubeAmount = confirmedDonations
    .filter((donation) => donation.source === 'youtube')
    .reduce((sum, donation) => sum + donation.amount_twd, 0)
  const ecpayAmount = confirmedDonations
    .filter((donation) => donation.source === 'ecpay')
    .reduce((sum, donation) => sum + donation.amount_twd, 0)
  const progressPercent = campaign.goal_amount > 0
    ? Number(((currentAmount / campaign.goal_amount) * 100).toFixed(1))
    : 0

  return {
    id: campaign.id,
    slug: campaign.slug,
    overlayToken: campaign.overlay_token,
    name: campaign.name,
    headline: campaign.headline,
    description: campaign.description,
    currency: campaign.currency,
    goalAmount: campaign.goal_amount,
    currentAmount,
    progressPercent,
    youtubeAmount,
    ecpayAmount,
    donorCount: confirmedDonations.length,
    status: campaign.status,
    embedEnabled: campaign.embed_enabled,
    overlayEnabled: campaign.overlay_enabled,
    updatedAt: campaign.updated_at,
    heroNote: '目前資料來自 Supabase campaigns / donation_events。之後可再補 integrations、OAuth token 與 ECPay 驗簽流程。',
    recentDonors: confirmedDonations
      .sort((a, b) => new Date(b.donated_at).getTime() - new Date(a.donated_at).getTime())
      .slice(0, 5)
      .map((donation) => ({
        id: donation.id,
        name: donation.donor_name || '匿名贊助者',
        amount: donation.amount_twd,
        source: donation.source,
        donatedAt: donation.donated_at
      }))
  }
}

export async function listCampaignPreviews() {
  const supabase = getSupabaseServerClient()

  if (!supabase) {
    return mockCampaigns
  }

  const { data: campaigns, error: campaignError } = await supabase
    .from('campaigns')
    .select('id, slug, overlay_token, name, headline, description, currency, goal_amount, status, embed_enabled, overlay_enabled, updated_at')
    .order('updated_at', { ascending: false })
    .limit(12)

  if (campaignError || !campaigns) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to load campaigns from Supabase.'
    })
  }

  const campaignIds = campaigns.map((campaign) => campaign.id)
  const { data: donations, error: donationError } = await supabase
    .from('donation_events')
    .select('id, campaign_id, donor_name, amount_twd, source, donated_at')
    .in('campaign_id', campaignIds)
    .eq('status', 'confirmed')

  if (donationError || !donations) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Unable to load donation events from Supabase.'
    })
  }

  return campaigns.map((campaign) =>
    toCampaignPreview(
      campaign as CampaignRow,
      donations
        .filter((donation) => donation.campaign_id === campaign.id)
        .map((donation) => ({
          id: donation.id,
          donor_name: donation.donor_name,
          amount_twd: donation.amount_twd,
          source: donation.source,
          donated_at: donation.donated_at
        }))
    )
  )
}

export async function getCampaignBySlug(slug: string) {
  const campaigns = await listCampaignPreviews()
  return campaigns.find((campaign) => campaign.slug === slug) || null
}

export async function getCampaignByOverlayToken(token: string) {
  const campaigns = await listCampaignPreviews()
  return campaigns.find((campaign) => campaign.overlayToken === token) || null
}
