
/**
 * Unit test: components/redirect - RedirectPage
 */
import { render, screen } from '@testing-library/react'
import RedirectPage from '../index'

const mockReplace = jest.fn()
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
}))

jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}))

describe('components/redirect', () => {
  beforeEach(() => {
    mockReplace.mockClear()
  })

  it('render Loading khi mount', () => {
    render(<RedirectPage href="/api-products" />)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('gọi router.replace với href string', () => {
    render(<RedirectPage href="/profile" />)
    expect(mockReplace).toHaveBeenCalledWith('/profile')
  })

  it('gọi router.replace với href object (pathname + params)', () => {
    render(
      <RedirectPage
        href={{
          pathname: '/api-products',
          params: { redirect: '/dashboard' },
        }}
      />
    )
    expect(mockReplace).toHaveBeenCalledWith('/api-products', { redirect: '/dashboard' })
  })
})
