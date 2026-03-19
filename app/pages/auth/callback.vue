<script setup lang="ts">
import type { EmailOtpType } from '@supabase/supabase-js'

const route = useRoute()
const router = useRouter()
const supabase = useSupabaseClient()
const { initAuth, refreshSession, user } = useAuth()

const state = ref<'loading' | 'success' | 'error'>('loading')
const title = ref('正在確認你的信箱...')
const description = ref('FundCast 正在接手 Supabase 驗證回跳，完成後會把你帶回可繼續操作的頁面。')
const detail = ref('')

async function handleConfirmation() {
  await initAuth()

  const tokenHash = typeof route.query.token_hash === 'string' ? route.query.token_hash : null
  const type = typeof route.query.type === 'string' ? route.query.type : null
  const next = typeof route.query.next === 'string' ? route.query.next : '/dashboard'

  try {
    if (tokenHash && type) {
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash,
        type: type as EmailOtpType
      })

      if (error) {
        throw error
      }
    }
    else {
      await refreshSession()
    }

    if (user.value) {
      state.value = 'success'
      title.value = '信箱驗證成功，正在進入後台...'
      description.value = '你的帳號已完成驗證，接下來會自動前往 dashboard。'
      window.setTimeout(() => {
        void router.push(next)
      }, 1200)
      return
    }

    state.value = 'success'
    title.value = '信箱驗證成功'
    description.value = '現在可以回登入頁使用剛剛註冊的帳號登入。'
    window.setTimeout(() => {
      void router.push('/login?verified=1')
    }, 1400)
  }
  catch (error) {
    state.value = 'error'
    title.value = '驗證連結失敗或已過期'
    description.value = '請回登入頁重新註冊，或重新發送新的驗證流程再試一次。'
    detail.value = error instanceof Error ? error.message : 'Unknown confirmation error.'
  }
}

onMounted(() => {
  void handleConfirmation()
})
</script>

<template>
  <main class="callback-page">
    <section class="callback-card card">
      <span class="eyebrow">Auth Callback</span>
      <h1 class="section-title">{{ title }}</h1>
      <p class="section-copy">{{ description }}</p>

      <p v-if="state === 'loading'" class="notice notice--info">
        驗證中，請稍候...
      </p>

      <p v-if="state === 'success'" class="notice notice--info">
        驗證已完成，頁面會自動跳轉。
      </p>

      <p v-if="state === 'error'" class="notice notice--error">
        {{ detail || '請回登入頁重新操作。' }}
      </p>

      <div class="button-row">
        <NuxtLink class="button secondary" to="/login">
          回登入頁
        </NuxtLink>
        <NuxtLink class="button primary" to="/dashboard">
          前往 dashboard
        </NuxtLink>
      </div>
    </section>
  </main>
</template>

<style scoped>
.callback-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.callback-card {
  width: min(100%, 620px);
  display: grid;
  gap: 18px;
  padding: 28px;
  border-radius: var(--radius-xl);
}

.callback-card h1 {
  margin: 0;
}
</style>
