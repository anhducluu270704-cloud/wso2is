import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ListGrid } from '../index'

const mockUsePaginationGrid = jest.fn()
const mockOnLoadMore = jest.fn()
const mockOnLoadLess = jest.fn()

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string, params?: { value?: string }) =>
    params?.value ? `${key}:${params.value}` : key,
}))

jest.mock('../../pagination/hook', () => ({
  usePaginationGrid: (args: unknown) => mockUsePaginationGrid(args),
}))

jest.mock('../../pagination/grid', () => ({
  PaginationGrid: ({
    onLoadMore,
    onLoadLess,
  }: {
    onLoadMore: () => void
    onLoadLess: () => void
  }) => (
    <div>
      <button onClick={onLoadMore}>load-more</button>
      <button onClick={onLoadLess}>load-less</button>
    </div>
  ),
}))

describe('share/components/list-grid/index', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePaginationGrid.mockReturnValue({
      visibleCount: 2,
      hasLoadMore: true,
      isFetchingNextPage: false,
      onLoadMore: mockOnLoadMore,
      onLoadLess: mockOnLoadLess,
    })
  })

  it('renders empty block when elements is empty', () => {
    render(
      <ListGrid
        elements={[]}
        limitPerPage={8}
        defaultPageSize={8}
        searchQuery="abc"
        hasNextPage={false}
        isFetchingNextPage={false}
        fetchNextPage={jest.fn()}
      />
    )

    expect(screen.getByText('empty.no_products_title')).toBeInTheDocument()
    expect(screen.getByText('empty.search:abc')).toBeInTheDocument()
  })

  it('renders grid with pagination and handles load actions', async () => {
    const user = userEvent.setup()
    const fetchNextPage = jest.fn()

    render(
      <ListGrid
        elements={[
          <div key="1">card-1</div>,
          <div key="2">card-2</div>,
          <div key="3">card-3</div>,
        ]}
        limitPerPage={6}
        defaultPageSize={4}
        hasNextPage
        isFetchingNextPage={false}
        fetchNextPage={fetchNextPage}
        syncLimitToUrl={false}
      />
    )

    expect(screen.getByText('card-1')).toBeInTheDocument()
    expect(screen.getByText('card-2')).toBeInTheDocument()
    expect(screen.queryByText('card-3')).not.toBeInTheDocument()

    expect(mockUsePaginationGrid).toHaveBeenCalledWith(
      expect.objectContaining({
        loadedItemCount: 3,
        defaultPageSize: 4,
        initialVisibleCount: 6,
        loadMoreChunkSize: 2,
        hasNextPage: true,
        syncLimitToUrl: false,
      })
    )

    await user.click(screen.getByRole('button', { name: 'load-more' }))
    await user.click(screen.getByRole('button', { name: 'load-less' }))

    expect(mockOnLoadMore).toHaveBeenCalledTimes(1)
    expect(mockOnLoadLess).toHaveBeenCalledTimes(1)
  })
})
