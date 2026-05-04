
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import EUHeader from '../index'

const mockUseAuthSession = jest.fn()
const mockMutate = jest.fn()
const mockUseGetUrlLoginMutation = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  Link: ({ children }: any) => <a href="/">{children}</a>,
  usePathname: () => '/',
  useRouter: () => ({}),
}))
jest.mock('@/providers/auth-session-provider', () => ({
  useAuthSession: () => mockUseAuthSession(),
}))
jest.mock('@/share/components/language-switch.tsx', () => ({ __esModule: true, default: () => <span>Lang</span> }))
jest.mock('@/share/components/user-dropdown.tsx', () => ({ __esModule: true, default: () => <span>UserDD</span> }))
jest.mock('next-intl', () => ({
  useLocale: () => 'vi',
  useTranslations: () =>
    Object.assign(
      (key: string) => (key === 'header.login' ? 'Log in' : key),
      { has: (key: string) => key === 'header.login' }
    ),
}))
jest.mock('next/image', () => ({ __esModule: true, default: (p: any) => <img alt={p.alt} /> }))
jest.mock('../hook', () => ({
  useGetUrlLoginMutation: (...args: any[]) => mockUseGetUrlLoginMutation(...args),
}))
jest.mock('../items', () => ({ EUHeaderItems: [{ title: 'Home', url: '/' }] }))
jest.mock('../list-items', () => ({ EUHeaderListItems: () => <span>Nav</span> }))
jest.mock('@/share/ui/drawer', () => ({
  Drawer: ({ children }: any) => <div>{children}</div>,
  DrawerClose: ({ children, asChild }: any) =>
    asChild ? <>{children}</> : <div>{children}</div>,
  DrawerContent: ({ children }: any) => <div>{children}</div>,
  DrawerHeader: () => null,
  DrawerTitle: () => null,
  DrawerTrigger: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('lucide-react', () => ({ Menu: () => null, ArrowRight: () => null }))

describe('share/layout/end-user/header', () => {
  beforeEach(() => {
    mockMutate.mockClear()
    mockUseGetUrlLoginMutation.mockReset()
    mockUseGetUrlLoginMutation.mockReturnValue({ mutate: mockMutate })
  })

  it('render EUHeader khi chưa login và click được cả hai nút login', async () => {
    mockUseAuthSession.mockReturnValue({ authSession: null })

    render(<EUHeader />)

    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(mockUseGetUrlLoginMutation).toHaveBeenCalledWith()

    const loginButtons = screen.getAllByRole('button', { name: /log in/i })
    expect(loginButtons).toHaveLength(2)

    await userEvent.click(loginButtons[0])
    await userEvent.click(loginButtons[1])

    expect(mockMutate).toHaveBeenCalledTimes(2)
    expect(screen.getByText('Nav')).toBeInTheDocument()
    expect(screen.getAllByText('Lang').length).toBeGreaterThan(0)
  })

  it('render EUHeader khi đã login', () => {
    mockUseAuthSession.mockReturnValue({
      authSession: { user: { fullname: 'Test User' } },
    })

    render(<EUHeader />)

    expect(screen.getByText('UserDD')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /log in/i })).not.toBeInTheDocument()
  })
})
