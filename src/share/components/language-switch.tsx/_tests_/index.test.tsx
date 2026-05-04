import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import LocalesDropdown from '../index'

const mockReplace = jest.fn()
const broadcastInstances: any[] = []
const mockUseSearchParams = jest.fn(() => ({
  toString: () => '',
}))
beforeAll(() => {
  global.BroadcastChannel = class MockBC {
    postMessage = jest.fn()
    close = jest.fn()
    onmessage: ((_: unknown) => void) | null = null
    constructor() {
      broadcastInstances.push(this)
    }
  } as any
})
jest.mock('@/i18n/navigation', () => ({
  usePathname: () => '/',
  useRouter: () => ({ replace: mockReplace }),
}))
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockUseSearchParams(),
}))
jest.mock('next-intl', () => ({ useLocale: () => 'vi' }))
jest.mock('@/share/icons', () => ({
  ChevronDown: () => null,
  Public: () => null,
}))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, ...p }: any) => <button {...p}>{children}</button>,
}))
jest.mock('@/share/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: any) => <div>{children}</div>,
  DropdownMenuContent: ({ children }: any) => <div>{children}</div>,
  DropdownMenuTrigger: ({ children }: any) => <>{children}</>,
  DropdownMenuItem: ({ children, onClick }: any) => (
    <button onClick={onClick}>{children}</button>
  ),
  DropdownMenuCheckboxItem: ({ children, onCheckedChange }: any) => (
    <button onClick={() => onCheckedChange?.(true)}>{children}</button>
  ),
}))

describe('share/components/language-switch LocalesDropdown', () => {
  beforeEach(() => {
    mockReplace.mockClear()
    broadcastInstances.length = 0
    mockUseSearchParams.mockReturnValue({
      toString: () => '',
    })
  })

  it('render với locale hiện tại', () => {
    render(<LocalesDropdown />)
    expect(screen.getAllByRole('button')[0]).toBeInTheDocument()
  })

  it('render showLabel và showGlobeIcon', () => {
    render(<LocalesDropdown showLabel showGlobeIcon />)
    expect(screen.getAllByText('Tiếng Việt')[0]).toBeInTheDocument()
  })

  it('changeLanguage gọi router.replace', async () => {
    render(<LocalesDropdown showLabel />)
    await userEvent.click(screen.getAllByRole('button')[0])
    const enBtn = screen.getByText('English')
    await userEvent.click(enBtn)
    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'en' })
    expect(broadcastInstances[0].postMessage).toHaveBeenCalledWith('en')
  })

  it('giữ nguyên search params khi đổi ngôn ngữ', async () => {
    mockUseSearchParams.mockReturnValue({
      toString: () => 'tab=profile&page=2',
    })

    render(<LocalesDropdown showLabel />)
    await userEvent.click(screen.getByText('English'))

    expect(mockReplace).toHaveBeenCalledWith('/?tab=profile&page=2', {
      locale: 'en',
    })
  })

  it('handle broadcast message từ tab khác', () => {
    render(<LocalesDropdown />)

    broadcastInstances[0].onmessage?.({ data: 'en' })

    expect(mockReplace).toHaveBeenCalledWith('/', { locale: 'en' })
  })

  it('đóng broadcast channel khi unmount', () => {
    const { unmount } = render(<LocalesDropdown />)

    unmount()

    expect(broadcastInstances[0].close).toHaveBeenCalled()
  })
})
