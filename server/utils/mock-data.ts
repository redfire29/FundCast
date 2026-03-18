import type { CampaignPreview } from '~~/shared/types/fundraising'

export const mockCampaigns: CampaignPreview[] = [
  {
    id: 'camp_demo_shelter',
    slug: 'shelter-paws-2026',
    overlayToken: 'ovl_demo_shelter',
    name: '浪浪春季醫療基金',
    headline: '把 YouTube 與綠界抖內，合併成一條能直接上直播的募資進度條。',
    description: '這是一份可直接部署到 Vercel 的 Nuxt 4 起始版本。你可以先用這筆示範資料做展示，之後再接上 Supabase、YouTube 與綠界。',
    currency: 'TWD',
    goalAmount: 200000,
    currentAmount: 116800,
    progressPercent: 58.4,
    youtubeAmount: 68400,
    ecpayAmount: 45200,
    donorCount: 74,
    status: 'active',
    embedEnabled: true,
    overlayEnabled: true,
    updatedAt: '2026-03-18T15:30:00+08:00',
    heroNote: '支援網站嵌入、OBS overlay、公用 API，以及之後擴充 YouTube / 綠界設定頁。',
    recentDonors: [
      {
        id: 'don_001',
        name: 'Ariel',
        amount: 1200,
        source: 'youtube',
        donatedAt: '2026-03-18T15:18:00+08:00'
      },
      {
        id: 'don_002',
        name: '匿名贊助者',
        amount: 500,
        source: 'ecpay',
        donatedAt: '2026-03-18T15:11:00+08:00'
      },
      {
        id: 'don_003',
        name: 'Ming',
        amount: 2000,
        source: 'youtube',
        donatedAt: '2026-03-18T15:08:00+08:00'
      }
    ]
  }
]
