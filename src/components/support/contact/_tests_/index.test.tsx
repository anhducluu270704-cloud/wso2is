
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SupportContact } from '../index'

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/share/ui/card', () => ({
  Card: ({ children, role, onClick }: any) => (
    <div role={role} onClick={onClick} data-testid={onClick ? 'card-button' : undefined}>{children}</div>
  ),
  CardContent: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/components/support/modal/create', () => ({
  SupportRequestModal: ({ open, onClose }: { open: boolean; onClose: () => void }) =>
    open ? (
      <div data-testid="request-modal">
        Request Modal
        <button type="button" onClick={onClose}>Close</button>
      </div>
    ) : null,
}))
jest.mock('@/share/icons/icon-contact-phone.svg', () => ({ __esModule: true, default: () => <span>Phone</span> }))
jest.mock('@/share/icons/icon-contact-email.svg', () => ({ __esModule: true, default: () => <span>Email</span> }))
jest.mock('@/share/icons/icon-contact-statement.svg', () => ({ __esModule: true, default: () => <span>Statement</span> }))

describe('support/contact', () => {
  it('render SupportContact', () => {
    render(<SupportContact />)
    expect(screen.getByText('heading')).toBeInTheDocument()
  })

  it('renders hotline and email values', () => {
    render(<SupportContact />)
    expect(screen.getByText('hotline_value')).toBeInTheDocument()
    expect(screen.getByText('email_value')).toBeInTheDocument()
  })

  it('opens request modal when leave request card is clicked', async () => {
    const user = userEvent.setup()
    render(<SupportContact />)
    expect(screen.queryByTestId('request-modal')).not.toBeInTheDocument()
    const leaveRequestCard = screen.getByTestId('card-button')
    await user.click(leaveRequestCard)
    expect(screen.getByTestId('request-modal')).toBeInTheDocument()
    expect(screen.getByText('Request Modal')).toBeInTheDocument()
  })

  it('closes request modal when onClose is called', async () => {
    const user = userEvent.setup()
    render(<SupportContact />)
    await user.click(screen.getByTestId('card-button'))
    expect(screen.getByTestId('request-modal')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Close' }))
    expect(screen.queryByTestId('request-modal')).not.toBeInTheDocument()
  })
})