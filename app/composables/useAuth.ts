import type { Session, User } from '@supabase/supabase-js'

export function useAuth() {
  const supabase = useSupabaseClient()
  const user = useState<User | null>('auth-user', () => null)
  const session = useState<Session | null>('auth-session', () => null)
  const ready = useState<boolean>('auth-ready', () => false)
  const initialized = useState<boolean>('auth-initialized', () => false)

  async function refreshSession() {
    const { data } = await supabase.auth.getSession()
    session.value = data.session
    user.value = data.session?.user || null
    ready.value = true
  }

  async function initAuth() {
    if (initialized.value) {
      return
    }

    await refreshSession()

    supabase.auth.onAuthStateChange((_event, nextSession) => {
      session.value = nextSession
      user.value = nextSession?.user || null
      ready.value = true
    })

    initialized.value = true
  }

  async function signIn(email: string, password: string) {
    return supabase.auth.signInWithPassword({ email, password })
  }

  async function signUp(email: string, password: string) {
    return supabase.auth.signUp({ email, password })
  }

  async function signOut() {
    await supabase.auth.signOut()
    session.value = null
    user.value = null
  }

  return {
    user,
    session,
    ready,
    initAuth,
    refreshSession,
    signIn,
    signUp,
    signOut
  }
}
