
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateApplicationWrapper from '../index'

const mockPush = jest.fn()
const mockBack = jest.fn()
jest.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: mockPush, back: mockBack }) }))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/components/application/create/form', () => ({
  __esModule: true,
  default: () => (
    <form>
      <span>Form</span>
    </form>
  )
}))
jest.mock('@/share/ui/button', () => ({ Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button> }))
jest.mock('@/share/ui/card', () => ({ Card: ({ children }: any) => <div>{children}</div>, CardContent: ({ children }: any) => <div>{children}</div> }))
jest.mock('lucide-react', () => ({ ChevronLeft: () => null }))

describe('application/create', () => {
  beforeEach(() => {
    mockPush.mockClear()
    mockBack.mockClear()
  })

  it('render form', () => {
    render(<CreateApplicationWrapper callback="/en/api-products/api-1" />)
    expect(screen.getByText('Form')).toBeInTheDocument()
  })

  it('click back gọi router.back', async () => {
    render(<CreateApplicationWrapper callback="/en/api-products/api-1" />)
    await userEvent.click(screen.getByText('btn.default_back'))
    expect(mockBack).toHaveBeenCalled()
  })
})