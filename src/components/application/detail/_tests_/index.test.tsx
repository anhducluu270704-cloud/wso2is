import React from 'react'
import { act, render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ApplicationDetail from '../index'

const mockBack = jest.fn()
const mockPush = jest.fn()
const mockMutate = jest.fn()
const mockUpdateMutate = jest.fn()
const mockUsePathname = jest.fn(
  () => '/en/api-products/api-1/application/app-1',
)
let mockSearchParams = new URLSearchParams()

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ back: mockBack, push: mockPush }),
  usePathname: () => mockUsePathname(),
}))
jest.mock('next-intl', () => ({
  useTranslations: () =>
    Object.assign((k: string) => k, {
      rich: (key: string) => key,
    }),
}))
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}))
jest.mock('@/services/application/application.query-options', () => ({
  useGetApplication: jest.fn(),
}))
jest.mock('@/services/application/application.mutations', () => ({
  useDeleteApplicationMutation: () => ({
    mutate: mockMutate,
  }),
  useUpdateApplicationMutation: () => ({
    mutate: mockUpdateMutate,
  }),
}))
jest.mock('@/app/not-found', () => ({ __esModule: true, default: () => <div>404</div> }))
jest.mock('@/share/components/full-page/loading', () => ({ __esModule: true, default: () => <div>Loading</div> }))
jest.mock('@/share/ui/button', () => ({ Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button> }))
jest.mock('@/share/ui/card', () => ({
  Card: ({ children }: any) => <div>{children}</div>,
  CardContent: ({ children }: any) => <div>{children}</div>,
  CardFooter: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('lucide-react', () => ({ ChevronLeft: () => null }))
jest.mock('@/share/icons', () => ({
  ChartDonut: () => <span>ChartDonut</span>,
  DeleteDocument: () => <span>DeleteDocument</span>,
  DeleteIcon: () => <span>DeleteIcon</span>,
  KeyIcon: () => <span>KeyIcon</span>,
  LeadingIcon: () => null,
  WebhooksIcon: () => <span>WebhooksIcon</span>,
}))
jest.mock('@/share/ui/badge', () => ({ Badge: ({ children }: any) => <span>{children}</span> }))
jest.mock('@/services/api-product/apiProduct.query-options', () => ({
  useGetApiProductDetail: jest.fn(),
}))
jest.mock('@/share/components/list-tab', () => ({
  __esModule: true,
  default: ({ listItems }: { listItems: any[] }) => {
    const activeFromQuery = mockSearchParams.get('active')
    const active =
      listItems.find((i) => i.value === activeFromQuery && i.content != null) ??
      listItems.find((i) => i.content != null)
    return <div data-testid="active">{active?.content}</div>
  },
}))
jest.mock('../keys/access-key', () => ({
  __esModule: true,
  default: ({
    applicationData,
  }: {
    applicationData: { applicationId: string }
  }) => (
    <div>{`OAuth2TokensSection:${applicationData.applicationId}`}</div>
  ),
}))
jest.mock('../overview', () => ({
  __esModule: true,
  default: () => <div>OverviewSection</div>,
}))
jest.mock('../subscriptions', () => ({
  __esModule: true,
  default: () => <div>ApplicationSubscriptions</div>,
}))
jest.mock('@/share/components/modal/confirm', () => ({
  __esModule: true,
  default: ({ open, onOpenChange, title, description, onConfirm }: any) =>
    open ? (
      <div>
        <button type="button" onClick={() => onOpenChange(false)}>
          modal-dismiss
        </button>
        <div>{title}</div>
        <div>{description}</div>
        <button type="button" onClick={onConfirm}>
          confirm-delete
        </button>
      </div>
    ) : null,
}))

const useGetApplication = require('@/services/application/application.query-options').useGetApplication
const useGetApiProductDetail = require('@/services/api-product/apiProduct.query-options').useGetApiProductDetail

const applicationDetailData = (overrides: Record<string, unknown> = {}) => ({
  applicationId: 'app-1',
  name: 'My App',
  subscriptionCount: 2,
  throttlingPolicy: 'Bronze',
  description: 'A desc',
  tier: 'SANDBOX',
  status: 'ACTIVE',
  groups: [] as string[],
  attributes: {} as Record<string, unknown>,
  owner: 'owner-1',
  tokenType: 'JWT',
  ...overrides,
})

describe('application/detail/index', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockSearchParams = new URLSearchParams()
    mockMutate.mockReset()
    mockPush.mockReset()
    mockUpdateMutate.mockReset()
    mockBack.mockReset()
    mockUsePathname.mockReturnValue(
      '/en/api-products/api-1/application/app-1',
    )
    mockUpdateMutate.mockImplementation((_data, { onSettled }) => {
      onSettled?.()
    })
  })

  beforeEach(() => {
    useGetApiProductDetail.mockReturnValue({
      data: { data: { name: 'API Product' } },
    })
  })

  it('render Loading khi isLoading', () => {
    useGetApplication.mockReturnValue({ data: null, isError: false, isLoading: true, isSuccess: false })
    render(<ApplicationDetail app_id="app-1" api_product_name="api-1" active="access-token" />)
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('render 404 khi isError', () => {
    useGetApplication.mockReturnValue({ data: null, isError: true, isLoading: false, isSuccess: false })
    render(<ApplicationDetail app_id="app-1" api_product_name="api-1" active="access-token" />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('render detail khi isSuccess với data', () => {
    mockSearchParams = new URLSearchParams('active=access-key')
    useGetApplication.mockReturnValue({
      data: {
        data: applicationDetailData(),
      },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(<ApplicationDetail app_id="app-1" api_product_name="api-1" active="access-key" />)
    expect(screen.getByText('My App')).toBeInTheDocument()
    expect(screen.getByText('btn.back')).toBeInTheDocument()
    expect(screen.getByText('2 Subscription')).toBeInTheDocument()
    expect(screen.getByTestId('active')).toHaveTextContent(
      'OAuth2TokensSection:app-1',
    )
  })

  it('render vẫn ok khi name undefined', () => {
    useGetApplication.mockReturnValue({
      data: { data: { applicationId: 'app-2', subscriptionCount: 0 } },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(<ApplicationDetail app_id="app-2" api_product_name="api-1" active="access-token" />)
    expect(screen.getByText('btn.back')).toBeInTheDocument()
  })

  it('click back gọi router.push tới parent của application', async () => {
    useGetApplication.mockReturnValue({
      data: { data: { applicationId: 'app-1', name: 'App' } },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(<ApplicationDetail app_id="app-1" api_product_name="api-1" active="access-token" />)
    await userEvent.click(screen.getByText('btn.back'))
    expect(mockPush).toHaveBeenCalledWith('/en/api-products/api-1')
  })

  it('mở confirm delete và gọi mutate, sau đó push về trang api-product khi onSuccess', async () => {
    mockUsePathname.mockReturnValue('/en/api-products/api-1/application/app-del')
    useGetApplication.mockReturnValue({
      data: {
        data: applicationDetailData({
          applicationId: 'app-del',
          name: 'Delete App',
        }),
      },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    mockMutate.mockImplementation((...args: any[]) => {
      const options = args[1]
      options.onSuccess()
    })

    render(<ApplicationDetail app_id="app-del" api_product_name="api-1" active="access-token" />)

    await userEvent.click(screen.getByText('btn.delete_application'))
    expect(screen.getByText('confirm_delete.title')).toBeInTheDocument()
    expect(screen.getByText('confirm_delete.description')).toBeInTheDocument()

    await userEvent.click(screen.getByText('confirm-delete'))

    expect(mockMutate).toHaveBeenCalledWith(
      'app-del',
      expect.objectContaining({
        onSuccess: expect.any(Function),
      }),
    )
    expect(mockPush).toHaveBeenCalledWith(
      '/en/api-products/api-1?inlinetoasttype=success&inlinetoastmsgkey=mess.delete.success',
    )
  })

  it('không crash khi chưa ở trạng thái success/loading/error', () => {
    useGetApplication.mockReturnValue({
      data: null,
      isError: false,
      isLoading: false,
      isSuccess: false,
    })
    render(<ApplicationDetail app_id="app-0" api_product_name="api-1" active="access-token" />)
  })

  it('active keys được map sang oauth2-tokens (tab OAuth2)', () => {
    mockSearchParams = new URLSearchParams('active=access-key')
    useGetApplication.mockReturnValue({
      data: { data: applicationDetailData({ applicationId: 'app-k' }) },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail app_id="app-k" api_product_name="api-1" active="keys" />,
    )
    expect(screen.getByTestId('active')).toHaveTextContent(
      'OAuth2TokensSection:app-k',
    )
  })

  it('tab overview hiển thị OverviewSection', () => {
    mockSearchParams = new URLSearchParams('active=overview')
    useGetApplication.mockReturnValue({
      data: { data: applicationDetailData() },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail app_id="app-1" api_product_name="api-1" active="overview" />,
    )
    expect(screen.getByTestId('active')).toHaveTextContent('OverviewSection')
  })

  it('tab api-registration hiển thị ApplicationSubscriptions', () => {
    mockSearchParams = new URLSearchParams('active=api-registration')
    useGetApplication.mockReturnValue({
      data: { data: applicationDetailData() },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail
        app_id="app-1"
        api_product_name="api-1"
        active="api-registration"
      />,
    )
    expect(screen.getByTestId('active')).toHaveTextContent(
      'ApplicationSubscriptions',
    )
  })

  it('back: sau khi cắt suffix application chỉ còn rỗng thì push /api-products', async () => {
    mockUsePathname.mockReturnValue('/application/app-99')
    useGetApplication.mockReturnValue({
      data: {
        data: applicationDetailData({ applicationId: 'app-99' }),
      },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail app_id="app-99" api_product_name="api-1" active="overview" />,
    )
    await userEvent.click(screen.getByText('btn.back'))
    expect(mockPush).toHaveBeenCalledWith('/api-products')
  })

  it('đổi tên app: mở editor, chỉnh và blur gọi update mutate', async () => {
    useGetApplication.mockReturnValue({
      data: { data: applicationDetailData({ name: 'OldName' }) },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail app_id="app-1" api_product_name="api-1" active="overview" />,
    )

    await userEvent.click(
      within(screen.getByText('OldName').closest('div')!).getByRole('button'),
    )

    const input = screen.getByRole('textbox', { name: 'Application name' })
    await userEvent.clear(input)
    await userEvent.type(input, 'NewNameOk')
    input.blur()

    await waitFor(() => {
      expect(mockUpdateMutate).toHaveBeenCalled()
    })

    expect(mockUpdateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'NewNameOk',
        throttlingPolicy: 'Bronze',
        description: 'A desc',
      }),
      expect.objectContaining({ onSettled: expect.any(Function) }),
    )
  })

  it('đổi tên: Escape đóng editor và không gọi update', async () => {
    useGetApplication.mockReturnValue({
      data: { data: applicationDetailData({ name: 'KeepName' }) },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail app_id="app-1" api_product_name="api-1" active="overview" />,
    )

    await userEvent.click(
      within(screen.getByText('KeepName').closest('div')!).getByRole('button'),
    )
    const input = screen.getByRole('textbox', { name: 'Application name' })
    await userEvent.type(input, 'X')
    await userEvent.keyboard('{Escape}')

    expect(screen.getByText('KeepName')).toBeInTheDocument()
    expect(mockUpdateMutate).not.toHaveBeenCalled()
  })

  it('rename: blur without changing name does not call update', async () => {
    useGetApplication.mockReturnValue({
      data: { data: applicationDetailData({ name: 'SameName' }) },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail app_id="app-1" api_product_name="api-1" active="overview" />,
    )

    await userEvent.click(
      within(screen.getByText('SameName').closest('div')!).getByRole('button'),
    )
    const input = screen.getByRole('textbox', { name: 'Application name' })
    await act(async () => {
      input.blur()
    })

    await waitFor(() => {
      expect(mockUpdateMutate).not.toHaveBeenCalled()
    })
  })

  it('đóng modal delete qua onOpenChange', async () => {
    useGetApplication.mockReturnValue({
      data: { data: applicationDetailData({ name: 'X' }) },
      isError: false,
      isLoading: false,
      isSuccess: true,
    })
    render(
      <ApplicationDetail app_id="app-1" api_product_name="api-1" active="overview" />,
    )
    await userEvent.click(screen.getByText('btn.delete_application'))
    expect(screen.getByText('confirm-delete')).toBeInTheDocument()

    await userEvent.click(screen.getByText('modal-dismiss'))

    expect(screen.queryByText('confirm-delete')).not.toBeInTheDocument()
  })
})