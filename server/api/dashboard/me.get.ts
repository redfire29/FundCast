import { requireSupabaseUser } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireSupabaseUser(event)

  return {
    user: {
      id: user.id,
      email: user.email
    }
  }
})
