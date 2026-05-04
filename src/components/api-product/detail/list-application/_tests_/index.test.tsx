import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ListApplication from '../index'

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => 'vi',
}))
let mockSearchParams = new URLSearchParams()
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}))
jest.mock('@/providers/auth-session-provider', () => ({
  useAuthSession: jest.fn(),
}))
const mockMutate = jest.fn()
jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: () => ({ mutate: mockMutate }),
}))
jest.mock('@/share/components/empty-state', () => ({
  __esModule: true,
  default: ({ title, buttonTitle, onClick }: any) => (
    <div>
      <span>{title}</span>
      <button onClick={onClick}>{buttonTitle}</button>
    </div>
  ),
}))
jest.mock('@/providers/filter-provider', () => ({
  FilterProvider: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/util/filter', () => ({ parseFilterSearchParams: jest.fn() }))
jest.mock('@/components/application/listing', () => ({
  __esModule: true,
  default: () => <div>ListingView</div>,
}))

const useAuthSession =
  require('@/providers/auth-session-provider').useAuthSession
const parseFilterSearchParams = require('@/util/filter').parseFilterSearchParams

describe('api-product/detail/list-application', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams()
    mockMutate.mockClear()
    useAuthSession.mockReturnValue({ authSession: null })
    parseFilterSearchParams.mockReturnValue({
      data: { limit: 10, offset: 0 },
      error: null,
    })
  })

  it('render EmptyState khi không authSession', () => {
    render(<ListApplication api_id="api-1" />)
    expect(screen.getByText('listing.not_auth.title')).toBeInTheDocument()
    expect(screen.getByText('btn.login')).toBeInTheDocument()
  })

  it('render ListingView khi có authSession', () => {
    useAuthSession.mockReturnValue({ authSession: {} })
    parseFilterSearchParams.mockReturnValue({
      data: { limit: 10, offset: 0 },
      error: null,
    })
    render(<ListApplication api_id="api-1" />)
    expect(screen.getByText('ListingView')).toBeInTheDocument()
  })

  it('render Invalid Query Params khi parseResult.error', () => {
    useAuthSession.mockReturnValue({ authSession: {} })
    parseFilterSearchParams.mockReturnValue({
      data: null,
      error: new Error('invalid'),
    })
    render(<ListApplication api_id="api-1" />)
    expect(screen.getByText('Invalid Query Params')).toBeInTheDocument()
  })

  it('click login gọi mutate', async () => {
    render(
      <ListApplication
        api_id="api-1"
        api_product_name="test-api-product"
        showInlineToast="create-success"
      />
    )

    await userEvent.click(screen.getByText('btn.login'))

    expect(mockMutate).toHaveBeenCalled()
  })

  it('parse page và limit từ search params', () => {
    mockSearchParams = new URLSearchParams('page=2&limit=20')
    useAuthSession.mockReturnValue({ authSession: {} })

    render(
      <ListApplication
        api_id="api-1"
        api_product_name="test-api-product"
        showInlineToast="create-success"
      />
    )

    expect(parseFilterSearchParams).toHaveBeenCalledWith({
      page: 2,
      limit: 20,
    })
  })
})
