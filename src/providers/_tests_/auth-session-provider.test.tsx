
import React from 'react'
import { render, screen } from '@testing-library/react'
import { AuthSessionProvider, useAuthSession } from '../auth-session-provider'

const mockAuthSession = {
  access_token: 'token',
  id_token: 'id',
  refresh_token: 'refresh',
  refresh_at: Date.now() + 3600000,
  user: { fullname: 'User', sub: 'sub', org_id: 'o1' },
}

function Consumer() {
  const { authSession } = useAuthSession()
  return <span>{authSession ? authSession.user?.fullname : 'null'}</span>
}

describe('AuthSessionProvider', () => {
  it('render children và provide authSession', () => {
    render(
      <AuthSessionProvider authSession={mockAuthSession}>
        <Consumer />
      </AuthSessionProvider>
    )
    expect(screen.getByText('User')).toBeInTheDocument()
  })

  it('provide null authSession', () => {
    render(
      <AuthSessionProvider authSession={null}>
        <Consumer />
      </AuthSessionProvider>
    )
    expect(screen.getByText('null')).toBeInTheDocument()
  })

  it('useAuthSession ném lỗi khi dùng ngoài provider', () => {
    expect(() => render(<Consumer />)).toThrow('useAuth must be used within AuthProvider')
  })
})
