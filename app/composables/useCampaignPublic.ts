import type { CampaignPreview } from '~~/shared/types/fundraising'

export function useCampaignList() {
  return useFetch<{ campaigns: CampaignPreview[] }>('/api/public/campaigns', {
    key: 'campaign-list'
  })
}

export function useCampaignBySlug(slug: MaybeRefOrGetter<string>) {
  const campaignSlug = computed(() => toValue(slug))

  return useFetch<{ campaign: CampaignPreview }>(() => `/api/public/campaigns/${campaignSlug.value}`, {
    key: () => `campaign-${campaignSlug.value}`
  })
}

export function useOverlayCampaign(token: MaybeRefOrGetter<string>) {
  const overlayToken = computed(() => toValue(token))

  return useFetch<{ campaign: CampaignPreview }>(() => `/api/public/overlay/${overlayToken.value}`, {
    key: () => `overlay-${overlayToken.value}`
  })
}
