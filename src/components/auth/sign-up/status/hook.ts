import authApi from '@/services/auth/auth.service'
import { useQuery } from '@tanstack/react-query'

export const parseTokenKeys = {
  all: ['auth', 'parse-token'] as const,
  byToken: (token: string) => [...parseTokenKeys.all, token] as const,
}

export function useParseToken(token: string) {
  return useQuery({
    queryKey: parseTokenKeys.byToken(token),
    queryFn: () => authApi.parseToken(token),
    retry: false,
  })
}
