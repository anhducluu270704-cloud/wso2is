
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ConfirmModal from '../confirm'

jest.mock('@/share/ui/alert-dialog', () => ({
  AlertDialog: ({ children, open }: any) => (open ? <div role="dialog">{children}</div> : null),
  AlertDialogAction: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
  AlertDialogCancel: ({ children }: any) => <button>{children}</button>,
  AlertDialogContent: ({ children }: any) => <div>{children}</div>,
  AlertDialogDescription: ({ children }: any) => <p>{children}</p>,
  AlertDialogFooter: ({ children }: any) => <div>{children}</div>,
  AlertDialogHeader: ({ children }: any) => <div>{children}</div>,
  AlertDialogMedia: ({ children }: any) => <div>{children}</div>,
  AlertDialogTitle: ({ children }: any) => <h2>{children}</h2>,
}))
jest.mock('lucide-react', () => ({ X: () => null }))
jest.mock('next-intl', () => ({ useTranslations: () => () => 'Cancel' }))

describe('share/components/modal/confirm', () => {
  it('render ConfirmModal khi open', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={jest.fn()}
        title="Confirm"
        description="Are you sure?"
        onConfirm={jest.fn()}
      />
    )
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    expect(screen.getByText('Are you sure?')).toBeInTheDocument()
  })

  it('hiển thị cancelTitle và confirmTitle tùy chỉnh', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={jest.fn()}
        title="Title"
        description="Desc"
        onConfirm={jest.fn()}
        cancelTitle="Hủy"
        confirmTitle="Xác nhận"
      />
    )
    expect(screen.getByText('Hủy')).toBeInTheDocument()
    expect(screen.getByText('Xác nhận')).toBeInTheDocument()
  })

  it('hiển thị icon khi truyền icon', () => {
    render(
      <ConfirmModal
        open={true}
        onOpenChange={jest.fn()}
        title="T"
        description="D"
        onConfirm={jest.fn()}
        icon={<span data-testid="custom-icon">Icon</span>}
      />
    )
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
  })

  it('gọi onConfirm và onOpenChange khi click nút confirm', async () => {
    const onConfirm = jest.fn()
    const onOpenChange = jest.fn()
    render(
      <ConfirmModal
        open={true}
        onOpenChange={onOpenChange}
        title="T"
        description="D"
        onConfirm={onConfirm}
        confirmTitle="OK"
      />
    )
    await userEvent.click(screen.getByText('OK'))
    expect(onConfirm).toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})