
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import { SupportRequestModal } from '../create'

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/share/components/modal', () => ({
  __esModule: true,
  default: ({
    open,
    title,
    onConfirm,
    confirmTitle,
    children,
  }: any) =>
    open ? (
      <div role="dialog">
        <h2>{title}</h2>
        <button onClick={onConfirm}>{confirmTitle}</button>
        {children}
      </div>
    ) : null,
}))
jest.mock('@/share/components/input', () => ({ __esModule: true, default: () => <input /> }))
jest.mock('@/share/components/input/select', () => ({ __esModule: true, default: () => <select /> }))
jest.mock('@/share/components/input/textarea', () => ({ __esModule: true, default: () => <textarea /> }))
const mockHandleSubmit = jest.fn((fn: any) => () => fn())
const mockOnSubmit = jest.fn()
const mockReset = jest.fn()

jest.mock('../hook', () => ({
  useSupportRequestForm: () => ({
    form: {
      register: () => ({}),
      handleSubmit: mockHandleSubmit,
      formState: { errors: {} },
      reset: mockReset,
    },
    onSubmit: mockOnSubmit,
    mutation: { isPending: false },
  }),
  defaultValues: {},
}))

describe('support/modal/create', () => {
  it('render SupportRequestModal khi open', () => {
    render(<SupportRequestModal open={true} onClose={jest.fn()} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('gọi handleSubmit(onSubmit) khi confirm', () => {
    render(<SupportRequestModal open={true} onClose={jest.fn()} />)

    const confirmBtn = screen.getByRole('button')
    fireEvent.click(confirmBtn)

    expect(mockHandleSubmit).toHaveBeenCalledWith(mockOnSubmit)
  })

  it('không render modal khi open = false', () => {
    render(<SupportRequestModal open={false} onClose={jest.fn()} />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('gọi form.reset khi open chuyển từ true sang false', () => {
    const { rerender } = render(<SupportRequestModal open={true} onClose={jest.fn()} />)
    rerender(<SupportRequestModal open={false} onClose={jest.fn()} />)
    expect(mockReset).toHaveBeenCalledWith({})
  })
})