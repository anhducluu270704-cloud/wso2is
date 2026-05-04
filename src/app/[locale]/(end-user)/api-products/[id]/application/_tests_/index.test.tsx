
import React from 'react'
import { render, screen } from '@testing-library/react'

const mockUseAuth = jest.fn()
const mockUseGetUrlLoginMutation = jest.fn()
const mockMutate = jest.fn()

jest.mock('next-intl', () => ({
  useLocale: () => 'vi',
}))

jest.mock('@/providers/auth-provider', () => ({
  useAuth: () => mockUseAuth(),
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div>LoadingPage</div>,
}))

jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: (url: string) => {
    mockUseGetUrlLoginMutation(url)
    return { mutate: mockMutate }
  },
}))

describe('ApplicationLayout', () => {
  const CHILD_TEXT = 'Application children'

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders children', async () => {
    mockUseAuth.mockReturnValue({ isLoading: true, authInfo: null })
    const { default: ApplicationLayout } = await import('../layout')

    render(
      <ApplicationLayout>
        <div>{CHILD_TEXT}</div>
      </ApplicationLayout>
    )

    expect(screen.getByText('LoadingPage')).toBeInTheDocument()
  })

  it('renders children when not authenticated', async () => {
    mockUseAuth.mockReturnValue({ isLoading: false, authInfo: null })
    const { default: ApplicationLayout } = await import('../layout')

    render(
      <ApplicationLayout>
        <div>{CHILD_TEXT}</div>
      </ApplicationLayout>
    )

    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument()
    expect(mockMutate).toHaveBeenCalled()
  })

  it('renders children và vẫn gọi mutation khi authenticated', async () => {
    mockUseAuth.mockReturnValue({ isLoading: false, authInfo: { userId: 'u1' } })
    const { default: ApplicationLayout } = await import('../layout')

    render(
      <ApplicationLayout>
        <div>{CHILD_TEXT}</div>
      </ApplicationLayout>
    )

    expect(screen.getByText(CHILD_TEXT)).toBeInTheDocument()
    expect(mockMutate).toHaveBeenCalledTimes(1)
  })
})

