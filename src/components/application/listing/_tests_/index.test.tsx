
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import ListingView from '../index'
import { MOCK_APPLICATION_DETAIL } from '@/_tests_/mocks'

const mockPush = jest.fn()
const mockReplace = jest.fn()
const mockShowSuccess = jest.fn()
const mockShowError = jest.fn()
let mockSearchParams = new URLSearchParams()
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush, replace: mockReplace }),
  usePathname: () => '/en/api-products/api-1',
}))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}))
const mockUseAuthSession = jest.fn()
jest.mock('@/providers/auth-session-provider', () => ({ useAuthSession: () => mockUseAuthSession() }))
const mockUseFilter = jest.fn()
jest.mock('@/providers/filter-provider', () => ({ useFilter: () => mockUseFilter() }))
const mockFetchNextPage = jest.fn()
const mockUseGetAllApplicationsInfinite = jest.fn()
jest.mock('@/services/application/application.query-options', () => ({
  useGetAllApplicationsInfinite: () => mockUseGetAllApplicationsInfinite(),
}))
jest.mock('@/app/not-found', () => ({ __esModule: true, default: () => <div>404</div> }))
jest.mock('@/share/components/empty-state', () => ({
  __esModule: true,
  default: ({ buttonTitle, onClick }: any) => <button onClick={onClick}>{buttonTitle}</button>,
}))
jest.mock('@/share/ui/button', () => ({ Button: ({ children, onClick, disabled }: any) => <button onClick={onClick} disabled={disabled}>{children}</button> }))
jest.mock('@/share/ui/spinner', () => ({ SpinnerCustom: () => <div>Spinner</div> }))
jest.mock('lucide-react', () => ({
  ChevronDown: () => <span>ChevronDown</span>,
  OctagonXIcon: () => <span>OctagonXIcon</span>,
  PlusIcon: () => <span>PlusIcon</span>,
}))
jest.mock('@/share/icons', () => ({
  ChevronDown: () => <span>ChevronDown</span>,
  ChevronUp: () => <span>ChevronUp</span>,
}))
jest.mock('../../inline-toast', () => ({
  __esModule: true,
  default: () => <div>InlineToast</div>,
  useApplicationInlineToast: () => ({
    inlineToast: null,
    isToastExiting: false,
    showSuccess: mockShowSuccess,
    showError: mockShowError,
  }),
}))
jest.mock('@/components/application/listing/card', () => ({
  __esModule: true,
  default: ({ application, onSubscribeSuccess, onSubscribeError }: any) => (
    <div>
      <div>Card: {application?.name}</div>
      <button onClick={() => onSubscribeSuccess?.('subscribe success', { durationMs: 10 })}>
        trigger-success
      </button>
      <button onClick={() => onSubscribeError?.('subscribe error', { durationMs: 10 })}>
        trigger-error
      </button>
    </div>
  ),
}))

describe('application/listing', () => {
  const defaultProps = {
    api_id: 'api-1',
    api_product_name: 'api-name',
    inlinetoasttype: '',
    inlinetoastmsgkey: '',
  }

  beforeEach(() => {
    mockSearchParams = new URLSearchParams()
    mockPush.mockClear()
    mockReplace.mockClear()
    mockShowSuccess.mockClear()
    mockShowError.mockClear()
    mockFetchNextPage.mockClear()
    mockUseAuthSession.mockReturnValue({ authSession: {} })
    mockUseFilter.mockReturnValue({ filter: { limit: 6, offset: 0 } })
    mockUseGetAllApplicationsInfinite.mockReturnValue({
      data: { pages: [{ data: { list: [MOCK_APPLICATION_DETAIL] } }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: mockFetchNextPage,
    })
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('render listing khi có data', () => {
    render(<ListingView {...defaultProps} />)
    expect(screen.getByText(/Card:/)).toBeInTheDocument()
  })

  it('render Loading khi đang fetch và chưa có data', () => {
    mockUseGetAllApplicationsInfinite.mockReturnValue({
      data: null,
      isFetching: true,
      isError: false,
      isSuccess: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: mockFetchNextPage,
    })
    render(<ListingView {...defaultProps} />)
    expect(screen.getByText('Spinner')).toBeInTheDocument()
  })

  it('render 404 khi isError', () => {
    mockUseGetAllApplicationsInfinite.mockReturnValue({
      data: null,
      isFetching: false,
      isError: true,
      isSuccess: false,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: mockFetchNextPage,
    })
    render(<ListingView {...defaultProps} />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('render empty state và click create', () => {
    mockUseGetAllApplicationsInfinite.mockReturnValue({
      data: { pages: [{ data: { list: [] } }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      hasNextPage: false,
      isFetchingNextPage: false,
      fetchNextPage: mockFetchNextPage,
    })

    render(<ListingView {...defaultProps} />)
    fireEvent.click(screen.getByText('listing.btn.create'))

    expect(mockPush).toHaveBeenCalledWith(
      '/api-products/api-1/application/create?callback=http://localhost/',
    )
  })

  it('render nút create khi đã đăng nhập và click load more', () => {
    mockUseGetAllApplicationsInfinite.mockReturnValue({
      data: { pages: [{ data: { list: [MOCK_APPLICATION_DETAIL] } }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      hasNextPage: true,
      isFetchingNextPage: false,
      fetchNextPage: mockFetchNextPage,
    })

    render(<ListingView {...defaultProps} />)
    fireEvent.click(screen.getByText('btn.create'))
    fireEvent.click(screen.getByText('btn.load_more'))

    expect(mockPush).toHaveBeenCalledWith(
      '/api-products/api-1/application/create?callback=http://localhost/',
    )
    expect(mockFetchNextPage).toHaveBeenCalled()
  })

  it('ẩn nút create và hiện spinner khi đang tải thêm', () => {
    mockUseAuthSession.mockReturnValue({ authSession: null })
    mockUseGetAllApplicationsInfinite.mockReturnValue({
      data: { pages: [{ data: { list: [MOCK_APPLICATION_DETAIL] } }] },
      isFetching: false,
      isError: false,
      isSuccess: true,
      hasNextPage: true,
      isFetchingNextPage: true,
      fetchNextPage: mockFetchNextPage,
    })

    render(<ListingView {...defaultProps} />)

    expect(screen.queryByText('btn.create')).not.toBeInTheDocument()
    expect(screen.getByText('Spinner')).toBeInTheDocument()
  })

  it('trigger success gọi showSuccess callback', () => {
    render(<ListingView {...defaultProps} />)

    fireEvent.click(screen.getByText('trigger-success'))

    expect(mockShowSuccess).toHaveBeenCalledWith(
      'mess.subscribe.success'
    )
  })

  it('trigger error gọi showError callback', () => {
    render(<ListingView {...defaultProps} />)

    fireEvent.click(screen.getByText('trigger-error'))

    expect(mockShowError).toHaveBeenCalledWith(
      'mess.subscribe.error'
    )
  })

  it('render inline toast component', () => {
    render(<ListingView {...defaultProps} />)
    expect(screen.getByText('InlineToast')).toBeInTheDocument()
  })
})