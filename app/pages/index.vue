<script setup lang="ts">
const { data, error } = await useCampaignList()

const campaigns = computed(() => data.value?.campaigns || [])
const appConfig = useRuntimeConfig()

const setupItems = [
  '在 Supabase 建立 campaigns、donation_events、integrations 三張表',
  '於 Vercel 設定 SUPABASE_URL、SUPABASE_SERVICE_ROLE_KEY、NUXT_PUBLIC_APP_URL',
  '用 /api/public/campaigns 與 /api/public/overlay/:token 提供網站與 OBS 資料',
  '第二階段再補 YouTube OAuth 與綠界 callback 寫入 donation_events'
]
</script>

<template>
  <main>
    <section class="hero">
      <div class="page-shell hero__grid">
        <div class="hero__copy">
          <span class="eyebrow">Nuxt 4 + Vercel Hobby + Supabase Free</span>
          <h1 class="section-title">多來源募資進度條的免費起步版</h1>
          <p class="section-copy">
            這個骨架先把公開進度頁、OBS overlay、Supabase data layer 與部署設定都鋪好。你可以先用 mock 資料演示，等客戶提供 YouTube / 綠界資料後再逐步接上。
          </p>

          <div class="button-row">
            <a class="button primary" href="#campaigns">看預覽</a>
            <a class="button secondary" href="https://vercel.com/new" target="_blank" rel="noreferrer">
              部署到 Vercel
            </a>
          </div>
        </div>

        <div class="hero__panel card">
          <div class="meta-grid">
            <div class="meta-item">
              <strong>Public App URL</strong>
              <span>{{ appConfig.public.appUrl }}</span>
            </div>
            <div class="meta-item">
              <strong>資料來源策略</strong>
              <span>Mock first / Supabase ready</span>
            </div>
            <div class="meta-item">
              <strong>輸出模式</strong>
              <span>Embed / Overlay / API</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="setup">
      <div class="page-shell setup__grid">
        <div>
          <span class="eyebrow">Launch Plan</span>
          <h2 class="section-title">第一版先把交付面做好</h2>
          <p class="section-copy">
            先讓客戶看到可用的嵌入頁與 overlay，再把後台設定、YouTube OAuth 與綠界 callback 逐步接進來，會比一開始就把所有整合打滿更穩。
          </p>
        </div>

        <div class="card setup__panel">
          <ol class="setup__list">
            <li v-for="item in setupItems" :key="item">{{ item }}</li>
          </ol>
        </div>
      </div>
    </section>

    <section id="campaigns" class="campaigns">
      <div class="page-shell">
        <div class="campaigns__header">
          <div>
            <span class="eyebrow">Preview Campaigns</span>
            <h2 class="section-title">目前可直接展示的公開頁</h2>
          </div>
        </div>

        <div v-if="error" class="campaigns__empty card">
          目前無法載入 campaign，請先確認 API 與 Supabase 設定。
        </div>

        <div v-else class="campaigns__grid">
          <FundProgressCard
            v-for="campaign in campaigns"
            :key="campaign.id"
            :campaign="campaign"
          />
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
.hero {
  padding: 56px 0 28px;
}

.hero__grid {
  display: grid;
  gap: 28px;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
}

.hero__copy {
  display: grid;
  gap: 22px;
}

.hero__copy h1 {
  margin: 0;
}

.hero__panel {
  padding: 24px;
  border-radius: var(--radius-xl);
}

.setup,
.campaigns {
  padding: 28px 0 48px;
}

.setup__grid {
  display: grid;
  gap: 28px;
  grid-template-columns: 0.9fr 1.1fr;
  align-items: center;
}

.setup__panel {
  padding: 24px;
  border-radius: var(--radius-xl);
}

.setup__list {
  margin: 0;
  padding-left: 22px;
  display: grid;
  gap: 14px;
  line-height: 1.7;
}

.campaigns__header {
  margin-bottom: 20px;
}

.campaigns__grid {
  display: grid;
  gap: 18px;
}

.campaigns__empty {
  padding: 24px;
  border-radius: var(--radius-xl);
}

@media (max-width: 920px) {
  .hero__grid,
  .setup__grid {
    grid-template-columns: 1fr;
  }
}
</style>
