interface AuthorizedFetchOptions<T> {
  method?: 'GET' | 'POST'
  body?: T
}

export async function useAuthorizedApi<TResponse, TBody = undefined>(
  path: string,
  options: AuthorizedFetchOptions<TBody> = {}
) {
  const { session, initAuth } = useAuth()

  await initAuth()

  const accessToken = session.value?.access_token

  if (!accessToken) {
    throw new Error('Missing session access token.')
  }

  return $fetch<TResponse>(path, {
    method: options.method,
    body: options.body,
    headers: {
      authorization: `Bearer ${accessToken}`
    }
  })
}
