
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApplicationForm from '../index'

const mockBack = jest.fn()
const mockPush = jest.fn()
const mockReset = jest.fn()
const mockHandleSubmit = jest.fn()
const mockWatch = jest.fn(() => 'watched description')
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
}))
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/share/components/input', () => ({ __esModule: true, default: () => <input name="name" /> }))
jest.mock('@/share/components/input/select', () => ({ __esModule: true, default: () => <select name="throttlingPolicy" /> }))
jest.mock('@/share/components/input/textarea', () => ({
  __esModule: true,
  default: ({ value }: { value?: string }) => <textarea name="description" value={value} readOnly />,
}))
jest.mock('@/share/ui/button', () => ({ Button: ({ children, onClick, type, disabled }: any) => <button type={type} onClick={onClick} disabled={disabled}>{children}</button> }))
jest.mock('../hook', () => ({
  useApplicationForm: (options: { onSuccess: () => void }) => ({
    form: {
      register: () => ({}),
      handleSubmit: (fn: any) => (e: any) => {
        e?.preventDefault()
        mockHandleSubmit()
        fn({})
      },
      formState: { errors: {} },
      reset: mockReset,
      control: {},
      watch: mockWatch,
    },
    handleSubmit: () => {
      options.onSuccess()
    },
    createMutation: { isPending: false },
  }),
}))

describe('application/create/form', () => {
  beforeEach(() => {
    mockBack.mockClear()
    mockPush.mockClear()
    mockReset.mockClear()
    mockHandleSubmit.mockClear()
    mockWatch.mockClear()
  })

  it('render ApplicationForm', () => {
    const { container } = render(<ApplicationForm callback="/api-products/test-id" />)
    expect(container.querySelector('form')).toBeInTheDocument()
    expect(screen.getByText('btn.cancel')).toBeInTheDocument()
    expect(screen.getByText('btn.next')).toBeInTheDocument()
  })

  it('click cancel gọi router.back', async () => {
    render(<ApplicationForm callback="/api-products/test-id" />)
    await userEvent.click(screen.getByText('btn.cancel'))
    expect(mockReset).toHaveBeenCalled()
    expect(mockBack).toHaveBeenCalled()
  })

  it('submit form gọi form.handleSubmit và dùng description từ watch', async () => {
    const { container } = render(<ApplicationForm callback="/api-products/test-id" />)

    await userEvent.click(screen.getByText('btn.next'))

    expect(mockHandleSubmit).toHaveBeenCalled()
    expect(container.querySelector('textarea')).toHaveValue('watched description')
  })

  it('submit kích hoạt onSuccess và router.push kèm inline toast params', async () => {
    render(<ApplicationForm callback="/api-products/my-api" />)

    await userEvent.click(screen.getByText('btn.next'))

    expect(mockPush).toHaveBeenCalledWith(
      '/api-products/my-api?inlinetoasttype=success&inlinetoastmsgkey=mess.create.success',
    )
  })

  it('fallback description về chuỗi rỗng khi watch trả undefined', () => {
    mockWatch.mockReturnValueOnce(undefined)

    const { container } = render(<ApplicationForm callback="/api-products/test-id" />)

    expect(container.querySelector('textarea')).toHaveValue('')
  })
})