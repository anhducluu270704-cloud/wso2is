import { act, fireEvent, render, renderHook, screen } from '@testing-library/react'
import InlineToast, { useApplicationInlineToast } from '../index'

const mockReplace = jest.fn()
const mockUseInlineToast = jest.fn()
const mockShowSuccess = jest.fn()
const mockShowError = jest.fn()
const mockShowWarning = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ replace: mockReplace }),
  usePathname: () => '/application',
}))
jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `translated:${key}`,
}))
jest.mock('next/navigation', () => ({
  useSearchParams: () =>
    new URLSearchParams(
      'inlinetoasttype=success&inlinetoastmsgkey=mess.create.success&foo=bar'
    ),
}))
jest.mock('@/share/hooks/use-inline-toast', () => ({
  useInlineToast: () => mockUseInlineToast(),
}))
jest.mock('@/share/icons', () => ({
  ToastSuccess: () => <span>ToastSuccess</span>,
  ToastError: () => <span>ToastError</span>,
  ToastInfo: () => <span>ToastInfo</span>,
}))

describe('components/application/inline-toast', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseInlineToast.mockReturnValue({
      inlineToast: null,
      isToastExiting: false,
      showSuccess: mockShowSuccess,
      showError: mockShowError,
      showWarning: mockShowWarning,
      dismissToast: jest.fn(),
    })
  })

  it('useApplicationInlineToast shows success and strips inline toast params', () => {
    renderHook(() =>
      useApplicationInlineToast('success', 'mess.create.success')
    )
    expect(mockShowSuccess).toHaveBeenCalledWith('translated:mess.create.success')
    expect(mockReplace).toHaveBeenCalledWith('/application?foo=bar')
  })

  it('useApplicationInlineToast maps error and warning types', () => {
    renderHook(() => useApplicationInlineToast('ERROR', 'mess.error'))
    expect(mockShowError).toHaveBeenCalledWith('translated:mess.error')

    renderHook(() => useApplicationInlineToast('unknown', 'mess.warn'))
    expect(mockShowWarning).toHaveBeenCalledWith('translated:mess.warn')
  })

  it('renders null when inlineToast is null', () => {
    const { container } = render(
      <InlineToast inlineToast={null} isToastExiting={false} />
    )
    expect(container.firstChild).toBeNull()
  })

  it('renders icon by type and dismisses on upward drag threshold', () => {
    const onDismiss = jest.fn()
    render(
      <InlineToast
        inlineToast={{ type: 'success', message: 'Done' }}
        isToastExiting={false}
        onDismiss={onDismiss}
      />
    )

    expect(screen.getByText('ToastSuccess')).toBeInTheDocument()
    const toast = screen.getByRole('button', { name: /Done/ })
    expect(toast).toBeInTheDocument()

    act(() => {
      fireEvent.mouseDown(toast as Element, { clientY: 100 })
    })
    act(() => {
      fireEvent.mouseMove(window, { clientY: 50 })
    })
    act(() => {
      fireEvent.mouseUp(window)
    })

    expect(onDismiss).toHaveBeenCalled()
  })

  it('renders error and warning icons', () => {
    const { rerender } = render(
      <InlineToast
        inlineToast={{ type: 'error', message: 'Oops' }}
        isToastExiting={false}
      />
    )
    expect(screen.getByText('ToastError')).toBeInTheDocument()

    rerender(
      <InlineToast
        inlineToast={{ type: 'warning', message: 'Warn' }}
        isToastExiting={false}
      />
    )
    expect(screen.getByText('ToastInfo')).toBeInTheDocument()
  })
})
