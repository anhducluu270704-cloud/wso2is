import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockBack = jest.fn()
const mockPush = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/share/icons', () => ({
  ToastSuccess: () => <div data-testid="toast-success" />,
}))

import CertificateStatus from '../index'

describe('CertificateStatus', () => {
  beforeEach(() => {
    mockBack.mockClear()
    mockPush.mockClear()
  })

  it('hiển thị nội dung success và điều hướng', async () => {
    render(<CertificateStatus />)
    expect(screen.getByTestId('toast-success')).toBeInTheDocument()
    expect(screen.getByText('create.status.title')).toBeInTheDocument()
    await userEvent.click(screen.getByRole('button', { name: 'btn.back' }))
    expect(mockBack).toHaveBeenCalled()
    await userEvent.click(screen.getByRole('button', { name: 'btn.compelete' }))
    expect(mockPush).toHaveBeenCalledWith('/')
  })
})
