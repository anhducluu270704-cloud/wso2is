
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '../index'

const mockOpenConfirmModal = jest.fn()
const mockCloseConfirmModal = jest.fn()
const mockUseModal = jest.fn()

jest.mock('@/share/hooks/use-modal', () => ({
  useModal: () => mockUseModal(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, rounded, size, variant, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

jest.mock('@/share/ui/dialog', () => ({
  Dialog: ({ children, open, onOpenChange }: any) => (
    <div data-testid="dialog-root" data-open={String(open)}>
      <button onClick={() => onOpenChange?.(false)}>close-dialog</button>
      {children}
    </div>
  ),
  DialogContent: ({ children, showCloseButton, className }: any) => (
    <div
      data-testid="dialog-content"
      data-show-close-button={String(showCloseButton)}
      className={className}
    >
      {children}
    </div>
  ),
  DialogDescription: ({ children }: any) => <p>{children}</p>,
  DialogFooter: ({ children, showCloseButton, cancelTitle }: any) => (
    <div
      data-testid="dialog-footer"
      data-show-close-button={String(showCloseButton)}
    >
      <span>{cancelTitle}</span>
      {children}
    </div>
  ),
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <h2>{children}</h2>,
}))

jest.mock('../../form', () => ({
  __esModule: true,
  default: ({ children }: any) => <form data-testid="form-body">{children}</form>,
}))

jest.mock('../confirm', () => ({
  __esModule: true,
  default: ({ open, onOpenChange, onConfirm, title, description }: any) =>
    open ? (
      <div data-testid="confirm-modal">
        <span>{title}</span>
        <span>{description}</span>
        <button onClick={onConfirm}>confirm-close</button>
        <button onClick={() => onOpenChange(false)}>confirm-on-open-change-false</button>
        <button onClick={() => onOpenChange(true)}>confirm-on-open-change-true</button>
      </div>
    ) : null,
}))

describe('share/components/modal', () => {
  beforeEach(() => {
    mockOpenConfirmModal.mockClear()
    mockCloseConfirmModal.mockClear()
    mockUseModal.mockReturnValue({
      isOpen: false,
      openModal: mockOpenConfirmModal,
      closeModal: mockCloseConfirmModal,
    })
  })

  it('render modal với nội dung mặc định và gọi onConfirm', async () => {
    const onConfirm = jest.fn()

    render(
      <Modal
        open
        title="Edit profile"
        description="Update account information"
        onConfirm={onConfirm}
        contentClassName="custom-content"
      >
        <span>Form content</span>
      </Modal>
    )

    expect(screen.getByText('Edit profile')).toBeInTheDocument()
    expect(screen.getByText('Update account information')).toBeInTheDocument()
    expect(screen.getByText('Form content')).toBeInTheDocument()
    expect(screen.getByText('btn.cancel')).toBeInTheDocument()
    expect(screen.getByTestId('dialog-content')).toHaveClass('custom-content')
    expect(screen.getByTestId('form-body')).toBeInTheDocument()

    await userEvent.click(screen.getByRole('button', { name: 'btn.save' }))
    expect(onConfirm).toHaveBeenCalledTimes(1)
  })

  it('disable nút confirm khi truyền confirmDisabled', () => {
    render(
      <Modal open title="Disabled state" onConfirm={jest.fn()} confirmDisabled>
        <span>Form content</span>
      </Modal>
    )

    expect(screen.getByRole('button', { name: 'btn.save' })).toBeDisabled()
  })

  it('mở confirm modal khi đóng và isConfirmClose bật', async () => {
    mockUseModal.mockReturnValue({
      isOpen: true,
      openModal: mockOpenConfirmModal,
      closeModal: mockCloseConfirmModal,
    })

    render(
      <Modal open title="Title" onConfirm={jest.fn()}>
        <span>Content</span>
      </Modal>
    )

    await userEvent.click(screen.getByRole('button', { name: 'close-dialog' }))

    expect(mockOpenConfirmModal).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('confirm-modal')).toBeInTheDocument()
    expect(screen.getByText('confirm.title')).toBeInTheDocument()
    expect(screen.getByText('confirm.description')).toBeInTheDocument()
  })

  it('đóng trực tiếp khi isConfirmClose tắt', async () => {
    const onOpenChange = jest.fn()

    render(
      <Modal
        open
        title="Title"
        onConfirm={jest.fn()}
        onOpenChange={onOpenChange}
        isConfirmClose={false}
        showCloseButton={false}
        confirmTitle="Submit"
        cancelTitle="Abort"
      >
        <span>Content</span>
      </Modal>
    )

    expect(screen.queryByText('Abort')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument()
    expect(screen.getByTestId('dialog-content')).toHaveAttribute(
      'data-show-close-button',
      'false'
    )

    await userEvent.click(screen.getByRole('button', { name: 'close-dialog' }))

    expect(mockOpenConfirmModal).not.toHaveBeenCalled()
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('xử lý callback của confirm modal', async () => {
    const onOpenChange = jest.fn()

    mockUseModal.mockReturnValue({
      isOpen: true,
      openModal: mockOpenConfirmModal,
      closeModal: mockCloseConfirmModal,
    })

    render(
      <Modal open title="Title" onConfirm={jest.fn()} onOpenChange={onOpenChange}>
        <span>Content</span>
      </Modal>
    )

    await userEvent.click(screen.getByRole('button', { name: 'confirm-close' }))
    await userEvent.click(
      screen.getByRole('button', { name: 'confirm-on-open-change-false' })
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'confirm-on-open-change-true' })
    )

    expect(mockCloseConfirmModal).toHaveBeenCalledTimes(3)
    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })
})
