<script setup lang="ts">
const router = useRouter()
const route = useRoute()
const { user, initAuth, signIn, signUp } = useAuth()

const email = ref('')
const password = ref('')
const mode = ref<'signin' | 'signup'>('signin')
const pending = ref(false)
const errorMessage = ref('')
const infoMessage = ref('')

onMounted(async () => {
  await initAuth()

  if (route.query.verified === '1') {
    infoMessage.value = '信箱驗證完成，現在可以直接登入。'
  }

  if (user.value) {
    await navigateTo('/dashboard')
  }
})

async function submit() {
  pending.value = true
  errorMessage.value = ''
  infoMessage.value = ''

  const action = mode.value === 'signin' ? signIn : signUp
  const { error, data } = await action(email.value, password.value)

  pending.value = false

  if (error) {
    errorMessage.value = error.message
    return
  }

  if (mode.value === 'signup' && !data.session) {
    infoMessage.value = '註冊成功，請到信箱點擊驗證連結。驗證完成後會自動回到站上。'
    return
  }

  const redirect = typeof route.query.redirect === 'string' ? route.query.redirect : '/dashboard'
  await router.push(redirect)
}
</script>

<template>
  <main class="auth-page">
    <div class="auth-page__panel card">
      <div class="auth-page__intro">
        <span class="eyebrow">FundCast Console</span>
        <h1 class="section-title">登入後台開始建立募資活動</h1>
        <p class="section-copy">
          第一版先提供 email/password 登入與 campaign 建立。之後再補 YouTube 綁定、綠界設定與更完整的後台流程。
        </p>
      </div>

      <div class="auth-page__mode">
        <button class="auth-page__toggle" :class="{ 'is-active': mode === 'signin' }" @click="mode = 'signin'">
          登入
        </button>
        <button class="auth-page__toggle" :class="{ 'is-active': mode === 'signup' }" @click="mode = 'signup'">
          註冊
        </button>
      </div>

      <form class="auth-form" @submit.prevent="submit">
        <label class="field">
          <span>Email</span>
          <input v-model="email" type="email" required autocomplete="email">
        </label>

        <label class="field">
          <span>密碼</span>
          <input v-model="password" type="password" minlength="6" required autocomplete="current-password">
        </label>

        <p v-if="errorMessage" class="notice notice--error">{{ errorMessage }}</p>
        <p v-if="infoMessage" class="notice notice--info">{{ infoMessage }}</p>

        <button class="button primary" :disabled="pending">
          {{ pending ? '處理中...' : mode === 'signin' ? '登入後台' : '建立帳號' }}
        </button>
      </form>
    </div>
  </main>
</template>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: grid;
  place-items: center;
  padding: 24px;
}

.auth-page__panel {
  width: min(100%, 560px);
  padding: 28px;
  border-radius: var(--radius-xl);
  display: grid;
  gap: 20px;
}

.auth-page__intro {
  display: grid;
  gap: 16px;
}

.auth-page__intro h1 {
  margin: 0;
}

.auth-page__mode {
  display: inline-grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
  padding: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.65);
}

.auth-page__toggle {
  min-height: 42px;
  border: 0;
  border-radius: 999px;
  background: transparent;
}

.auth-page__toggle.is-active {
  background: var(--surface-dark);
  color: white;
}

.auth-form {
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

.field input {
  min-height: 52px;
  padding: 0 16px;
  border-radius: 16px;
  border: 1px solid var(--line);
  background: rgba(255, 255, 255, 0.82);
}

.notice {
  margin: 0;
  padding: 12px 14px;
  border-radius: 14px;
  font-size: 14px;
}

.notice--error {
  background: rgba(209, 64, 64, 0.12);
  color: #a32a2a;
}

.notice--info {
  background: rgba(42, 157, 143, 0.14);
  color: #166c62;
}
</style>
