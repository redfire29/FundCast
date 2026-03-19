<script setup lang="ts">
definePageMeta({
  middleware: ['authenticated']
})

interface EditableCampaign {
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

const statusOptions = [
  { value: 'draft', label: '草稿' },
  { value: 'active', label: '進行中' },
  { value: 'paused', label: '已暫停' },
  { value: 'completed', label: '已完成' }
]

const route = useRoute()
const campaignId = computed(() => String(route.params.id || ''))

const loading = ref(true)
const saving = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const form = reactive({
  name: '',
  goalAmount: 0,
  description: '',
  status: 'draft',
  overlayEnabled: true
})

const campaign = ref<EditableCampaign | null>(null)

async function loadCampaign() {
  loading.value = true
  errorMessage.value = ''

  try {
    const response = await useAuthorizedApi<{ campaign: EditableCampaign }>(`/api/dashboard/campaigns/${campaignId.value}`)
    campaign.value = response.campaign
    form.name = response.campaign.name
    form.goalAmount = response.campaign.goal_amount
    form.description = response.campaign.description
    form.status = response.campaign.status
    form.overlayEnabled = response.campaign.overlay_enabled
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '無法載入 campaign。'
  }
  finally {
    loading.value = false
  }
}

async function saveCampaign() {
  saving.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    const response = await useAuthorizedApi<{ campaign: EditableCampaign }, typeof form>(
      `/api/dashboard/campaigns/${campaignId.value}`,
      {
        method: 'PATCH',
        body: form
      }
    )

    campaign.value = response.campaign
    successMessage.value = 'Campaign 更新成功。'
  }
  catch (error) {
    errorMessage.value = error instanceof Error ? error.message : '更新 campaign 失敗。'
  }
  finally {
    saving.value = false
  }
}

onMounted(() => {
  void loadCampaign()
})
</script>

<template>
  <main class="editor page-shell">
    <header class="editor__header">
      <div>
        <span class="eyebrow">Campaign Editor</span>
        <h1 class="section-title">編輯募資活動</h1>
        <p class="section-copy">
          調整公開顯示的名稱、目標金額、描述、活動狀態，以及是否開啟 overlay。
        </p>
      </div>

      <div class="button-row">
        <NuxtLink class="button secondary" to="/dashboard">
          回 dashboard
        </NuxtLink>
      </div>
    </header>

    <section class="editor__grid">
      <article class="editor__panel card">
        <div v-if="loading" class="editor__empty">載入中...</div>

        <form v-else class="editor-form" @submit.prevent="saveCampaign">
          <label class="field">
            <span>活動名稱</span>
            <input v-model="form.name" required>
          </label>

          <label class="field">
            <span>目標金額</span>
            <input v-model.number="form.goalAmount" type="number" min="1" required>
          </label>

          <label class="field">
            <span>活動描述</span>
            <textarea v-model="form.description" rows="5" required></textarea>
          </label>

          <label class="field">
            <span>活動狀態</span>
            <select v-model="form.status">
              <option v-for="option in statusOptions" :key="option.value" :value="option.value">
                {{ option.label }}
              </option>
            </select>
          </label>

          <label class="toggle">
            <input v-model="form.overlayEnabled" type="checkbox">
            <span>啟用 overlay 顯示</span>
          </label>

          <p v-if="errorMessage" class="notice notice--error">{{ errorMessage }}</p>
          <p v-if="successMessage" class="notice notice--info">{{ successMessage }}</p>

          <button class="button primary" :disabled="saving">
            {{ saving ? '儲存中...' : '儲存變更' }}
          </button>
        </form>
      </article>

      <article class="editor__panel card">
        <div class="editor__meta" v-if="campaign">
          <div class="meta-item">
            <strong>Slug</strong>
            <span>{{ campaign.slug }}</span>
          </div>
          <div class="meta-item">
            <strong>Overlay Token</strong>
            <span>{{ campaign.overlay_token }}</span>
          </div>
          <div class="meta-item">
            <strong>Overlay 頁面</strong>
            <span>
              <a :href="`/overlay/${campaign.overlay_token}`" target="_blank" rel="noreferrer">
                開啟 overlay
              </a>
            </span>
          </div>
        </div>
      </article>
    </section>
  </main>
</template>

<style scoped>
.editor {
  padding: 36px 0 56px;
  display: grid;
  gap: 24px;
}

.editor__header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: flex-start;
}

.editor__grid {
  display: grid;
  gap: 20px;
  grid-template-columns: 1.1fr 0.9fr;
}

.editor__panel {
  padding: 24px;
  border-radius: var(--radius-xl);
}

.editor__empty {
  color: var(--muted);
}

.editor-form {
  display: grid;
  gap: 14px;
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

.toggle {
  display: inline-flex;
  align-items: center;
  gap: 10px;
}

.editor__meta {
  display: grid;
  gap: 16px;
}

@media (max-width: 920px) {
  .editor__header,
  .editor__grid {
    grid-template-columns: 1fr;
  }

  .editor__header {
    flex-direction: column;
  }
}
</style>
