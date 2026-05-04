
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import UserDropdown from '../index'

const mockPush = jest.fn()
const mockLogout = jest.fn()
const mockUseAuthSession = jest.fn()

jest.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('@/providers/auth-provider', () => ({ useAuth: () => ({ logout: mockLogout }) }))
jest.mock('@/providers/auth-session-provider', () => ({
  useAuthSession: () => mockUseAuthSession(),
}))
jest.mock('@/share/icons', () => ({
  AlertLogout: () => null,
  ChevronDown: () => null,
  User: () => null,
  Certificate: () => null,
}))
jest.mock('lucide-react', () => ({ LogOut: () => null }))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/share/ui/avatar', () => ({
  Avatar: ({ children }: any) => <div>{children}</div>,
  AvatarFallback: ({ children }: any) => <span>{children}</span>,
}))
jest.mock('@/share/ui/button', () => ({ Button: ({ children, ...p }: any) => <button {...p}>{children}</button> }))
jest.mock('@/share/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <>{children}</>,
  DropdownMenuItem: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))
jest.mock('../../modal/confirm', () => ({ __esModule: true, default: ({ open, onConfirm }: any) =>
  open ? <div data-testid="confirm"><button onClick={onConfirm}>Confirm Logout</button></div> : null
}))

describe('share/components/user-dropdown', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockLogout.mockClear()
    mockUseAuthSession.mockReturnValue({
      authSession: { user_info: { fullName: 'Test User' } },
    })
  })

  it('render UserDropdown', () => {
    render(<UserDropdown />)
    expect(screen.getAllByRole('button')[0]).toBeInTheDocument()
    expect(screen.getByText('TU')).toBeInTheDocument()
  })

  it('click My Account gọi router.push /profile', async () => {
    render(<UserDropdown />)
    await userEvent.click(screen.getAllByRole('button')[0])
    const accountBtn = screen.getByText(/myaccount|header.myaccount/i)
    await userEvent.click(accountBtn)
    expect(mockPush).toHaveBeenCalledWith('/profile')
  })

  it('click Logout mở ConfirmModal, confirm gọi logout', async () => {
    render(<UserDropdown />)
    await userEvent.click(screen.getAllByRole('button')[0])
    await userEvent.click(screen.getByText(/logout|header.logout/i))
    expect(screen.getByTestId('confirm')).toBeInTheDocument()
    await userEvent.click(screen.getByText('Confirm Logout'))
    expect(mockLogout).toHaveBeenCalled()
  })

  it('fallback về ? khi không có session / tên', () => {
    mockUseAuthSession.mockReturnValue({ authSession: null })

    render(<UserDropdown />)

    expect(screen.getByText('?')).toBeInTheDocument()
  })
})
