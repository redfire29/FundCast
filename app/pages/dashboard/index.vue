<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated']
})

interface DashboardCampaign {
  id: string
  slug: string
  overlay_token: string
  name: string
  headline: string
  description: string
  currency: string
  goal_amount: number
  status: string
  embed_enabled: boolean
  overlay_enabled: boolean
  updated_at: string
}

const { user, signOut, initAuth } = useAuth()

const campaigns = ref<DashboardCampaign[]>([])
const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  headline: '',
  description: '',
  goalAmount: 100000,
  currency: 'TWD'
})

async function loadCampaigns() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await useAuthorizedApi<{ campaigns: DashboardCampaign[] }>('/api/dashboard/campaigns')
    campaigns.value = response.campaigns
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '無法載入 campaign。'

    if (error && typeof error === 'object' && 'statusCode' in error && Number(error.statusCode) === 401) {
      await navigateTo('/login')
    }
  }
  finally {
    loading.value = false
  }
}

async function createCampaign() {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await useAuthorizedApi<{ campaign: DashboardCampaign }, typeof form>(
      '/api/dashboard/campaigns',
      {
        method: 'POST',
        body: form
      }
    )

    campaigns.value = [response.campaign, ...campaigns.value]
    successMessage.value = 'Campaign 建立成功，下面已經可以直接打開 overlay 與 API。'
    form.name = ''
    form.headline = ''
    form.description = ''
    form.goalAmount = 100000
    form.currency = 'TWD'
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '建立 campaign 失敗。'
  }
  finally {
    saving.value = false
  }
}

async function logout() {
  await signOut()
  await navigateTo('/login')
}

onMounted(async () => {
  await initAuth()
  await loadCampaigns()
})
</script>

<template>
  <main class="dashboard page-shell">
    <header class="dashboard__header">
      <div>
        <span class="eyebrow">Dashboard</span>
        <h1 class="section-title">你的募資活動控制台</h1>
        <p class="section-copy">
          {{ user?.email }} 已登入。這一版先讓你建立活動並取得 overlay URL，之後再接 YouTube 與綠界設定。
        </p>
      </div>

      <div class="button-row">
        <NuxtLink class="button secondary" to="/">
          回首頁
        </NuxtLink>
        <button class="button primary" @click="logout">
          登出
        </button>
      </div>
    </header>

    <section class="dashboard__grid">
      <article class="dashboard__panel card">
        <div class="dashboard__section-head">
          <h2>建立新 campaign</h2>
          <p>建立後會自動產生公開 slug 與 overlay token。</p>
        </div>

        <form class="campaign-form" @submit.prevent="createCampaign">
          <label class="field">
            <span>活動名稱</span>
            <input v-model="form.name" required>
          </label>

          <label class="field">
            <span>標題文案</span>
            <input v-model="form.headline" required>
          </label>

          <label class="field">
            <span>活動描述</span>
            <textarea v-model="form.description" rows="4" required></textarea>
          </label>

          <div class="campaign-form__row">
            <label class="field">
              <span>目標金額</span>
              <input v-model.number="form.goalAmount" type="number" min="1" required>
            </label>

            <label class="field">
              <span>幣別</span>
              <select v-model="form.currency">
                <option value="TWD">TWD</option>
                <option value="USD">USD</option>
              </select>
            </label>
          </div>

          <p v-if="errorMessage" class="notice notice--error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="notice notice--info">{{ successMessage }}</p>

          <button class="button primary" :disabled="saving">
            {{ saving ? '建立中...' : '建立活動' }}
          </button>
        </form>
      </article>

      <article class="dashboard__panel card">
        <div class="dashboard__section-head">
          <h2>我的 campaigns</h2>
          <p>目前登入帳號建立的活動都會列在這裡。</p>
        </div>

        <div v-if="loading" class="dashboard__empty">
          載入中...
        </div>

        <div v-else-if="campaigns.length === 0" class="dashboard__empty">
          還沒有活動，先建立第一個 campaign。
        </div>

        <div v-else class="dashboard__list">
          <article v-for="campaign in campaigns" :key="campaign.id" class="dashboard-card">
            <div class="dashboard-card__top">
              <div>
                <h3>{{ campaign.name }}</h3>
                <p>{{ campaign.headline }}</p>
              </div>
              <span class="dashboard-card__status">{{ campaign.status }}</span>
            </div>

            <div class="chip-list">
              <span class="chip">slug: {{ campaign.slug }}</span>
              <span class="chip">token: {{ campaign.overlay_token }}</span>
            </div>

            <div class="dashboard-card__links">
              <a class="button secondary" :href="`/overlay/${campaign.overlay_token}`" target="_blank" rel="noreferrer">
                開 overlay
              </a>
              <a class="button secondary" :href="`/api/public/campaigns/${campaign.slug}`" target="_blank" rel="noreferrer">
                看 API
              </a>
            </div>
          </article>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.dashboard {
  padding: 36px 0 56px;
  display: grid;
  gap: 24px;
}

.dashboard__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.dashboard__header h1 {
  margin: 10px 0 14px;
}

.dashboard__grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 0.92fr 1.08fr;
}

.dashboard__panel {
  padding: 24px;
  border-radius: var(--radius-xl);
}

.dashboard__section-head {
  margin-bottom: 18px;
}

.dashboard__section-head h2 {
  margin: 0 0 8px;
}

.dashboard__section-head p {
  margin: 0;
  color: var(--muted);
}

.campaign-form {
  display: grid;
  gap: 14px;
}

.campaign-form__row {
  display: grid;
  gap: 14px;
  grid-template-columns: 1fr 180px;
}

.field {
  display: grid;
  gap: 8px;
}

.field span {
  font-size: 14px;
  color: var(--muted);
}

.field input,
.field textarea,
.field select {
  width: 100%;
  padding: 14px 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.82);
}

.dashboard__empty {
  padding: 18px 0;
  color: var(--muted);
}

.dashboard__list {
  display: grid;
  gap: 14px;
}

.dashboard-card {
  display: grid;
  gap: 14px;
  padding: 18px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid var(--line);
}

.dashboard-card__top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 14px;
}

.dashboard-card__top h3 {
  margin: 0 0 6px;
}

.dashboard-card__top p {
  margin: 0;
  color: var(--muted);
}

.dashboard-card__status {
  padding: 8px 10px;
  border-radius: 999px;
  background: rgba(42, 157, 143, 0.14);
  color: #166c62;
  text-transform: capitalize;
}

.dashboard-card__links {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.notice--error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  background: rgba(209, 64, 64, 0.12);
  color: #a32a2a;
}

@media (max-width: 960px) {
  .dashboard__header,
  .dashboard__grid,
  .campaign-form__row {
    grid-template-columns: 1fr;
  }

  .dashboard__header {
    flex-direction: column;
  }
}
</style>
