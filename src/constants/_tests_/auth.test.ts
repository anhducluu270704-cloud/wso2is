
import type { AUTH_SYNC_EVENT } from '@/constants/auth'

describe('constants/auth', () => {
  it('AUTH_SYNC_EVENT type là changed | logout', () => {
    const changed: AUTH_SYNC_EVENT = 'changed'
    const logout: AUTH_SYNC_EVENT = 'logout'
    expect(changed).toBe('changed')
    expect(logout).toBe('logout')
  })
})