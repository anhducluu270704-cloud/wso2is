
import React from 'react'
import { render, screen } from '@testing-library/react'
import GetTokenWrapper from '../index'

const mockUseAuth = jest.fn()
const mockMutate = jest.fn()

jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}))
jest.mock('@/services/auth/auth.mutations', () => ({
  useGetTokenMutation: () => ({ mutate: mockMutate }),
}))
jest.mock('next-intl', () => ({ useLocale: () => 'vi' }))
jest.mock('@/share/components/full-page/loading', () => ({ __esModule: true, default: () => <div>Loading</div> }))

describe('auth/get-token', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({ isLoading: false })
    mockMutate.mockClear()
  })

  it('render khi không loading và gọi mutate với redirect_uri', () => {
    render(<GetTokenWrapper code="auth-code-123" />)

    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(mockMutate).toHaveBeenCalledWith({
      code: 'auth-code-123',
      redirect_uri: 'http://localhost/vi/get-token',
    })
  })

  it('render loading wrapper khi auth đang loading', () => {
    mockUseAuth.mockReturnValue({ isLoading: true })

    render(<GetTokenWrapper code="auth-code-123" />)

    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(mockMutate).not.toHaveBeenCalled()
  })
})