
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableView } from '../index'

jest.mock('next-intl', () => ({
  useTranslations: () => () => 'table.empty',
}))

jest.mock('@/share/icons', () => ({
  Empty: () => <div>EmptyIcon</div>,
}))

jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  EmptyHeader: ({ children }: any) => <div>{children}</div>,
  EmptyContent: ({ children }: any) => <div>{children}</div>,
  EmptyTitle: ({ children }: any) => <div>{children}</div>,
  EmptyDescription: ({ children }: any) => <div data-testid="empty-desc">{children}</div>,
}))

jest.mock('@/share/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableHead: ({ children, onClick, endIcon }: any) => (
    <th onClick={onClick}>
      {children}
      {endIcon}
    </th>
  ),
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children, onClick, ...props }: any) => (
    <tr onClick={onClick} {...props}>
      {children}
    </tr>
  ),
  TableSortCol: ({ isShow, sort }: any) => (
    <span data-testid="sort-indicator">{`${String(isShow)}:${String(sort)}`}</span>
  ),
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick }: any) => (
    <button type="button" onClick={onClick}>
      {children}
    </button>
  ),
}))

jest.mock('../../pagination', () => ({
  __esModule: true,
  default: ({
    onPageChange,
    currentPage,
    totalPages,
  }: {
    onPageChange: (page: number) => void
    currentPage: number
    totalPages: number
  }) => (
    <button
      type="button"
      data-testid="pagination"
      data-current={currentPage}
      data-total={totalPages}
      onClick={() => onPageChange(2)}
    />
  ),
}))

function mockTable({
  selectable = false,
  sortable = false,
  withPlaceholderHeader = false,
  isSortedValue = sortable ? 'asc' : false,
}: {
  selectable?: boolean
  sortable?: boolean
  withPlaceholderHeader?: boolean
  isSortedValue?: string | false
} = {}) {
  const toggleSortingHandler = jest.fn()

  return {
    getHeaderGroups: () => [
      {
        id: '1',
        headers: [
          {
            id: 'name',
            column: {
              getCanSort: () => sortable,
              getToggleSortingHandler: () => toggleSortingHandler,
              getIsSorted: () => isSortedValue,
              columnDef: { header: 'Name' },
            },
            isPlaceholder: false,
            getContext: () => ({}),
          },
          ...(withPlaceholderHeader
            ? [
                {
                  id: 'placeholder',
                  column: {
                    getCanSort: () => false,
                    getToggleSortingHandler: () => undefined,
                    getIsSorted: () => false,
                    columnDef: { header: 'Ignored' },
                  },
                  isPlaceholder: true,
                  getContext: () => ({}),
                },
              ]
            : []),
        ],
      },
    ],
    getRowModel: () => ({
      rows: [
        {
          id: '1',
          original: { name: 'A' },
          getIsSelected: () => selectable,
          getVisibleCells: () => [
            { id: 'name', column: { columnDef: { cell: () => 'A' } }, getContext: () => ({}) },
          ],
        },
      ],
    }),
    getAllColumns: () => [],
    getPageCount: () => 1,
    setPageIndex: jest.fn(),
    getState: () => ({ pagination: { pageIndex: 0 } }),
    toggleSortingHandler,
  }
}

function mockTableEmpty() {
  const toggleSortingHandler = jest.fn()

  return {
    getHeaderGroups: () => [
      {
        id: '1',
        headers: [
          {
            id: 'name',
            column: {
              getCanSort: () => true,
              getToggleSortingHandler: () => toggleSortingHandler,
              getIsSorted: () => 'asc',
              columnDef: { header: 'Name' },
            },
            isPlaceholder: false,
            getContext: () => ({}),
          },
        ],
      },
    ],
    getRowModel: () => ({ rows: [] }),
    getAllColumns: () => [{ id: 'name' }],
    getPageCount: () => 1,
    setPageIndex: jest.fn(),
    getState: () => ({ pagination: { pageIndex: 0 } }),
    toggleSortingHandler,
  }
}

function mockTableWithPagination() {
  const base = mockTable() as any
  return {
    ...base,
    getPageCount: () => 2,
    setPageIndex: jest.fn(),
  }
}

describe('share/components/table', () => {
  it('render TableView với mock table', () => {
    render(<TableView table={mockTable() as any} />)
    expect(document.querySelector('table')).toBeInTheDocument()
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('hiển thị No results. khi không có rows', () => {
    render(<TableView table={mockTableEmpty() as any} />)
    expect(screen.getByText('table.empty')).toBeInTheDocument()
  })

  it('hiển thị emptyTitle và emptyDescription khi truyền props', () => {
    render(
      <TableView
        table={mockTableEmpty() as any}
        emptyTitle="No APIs yet"
        emptyDescription="Go back to request an API."
      />,
    )
    expect(screen.getByText('No APIs yet')).toBeInTheDocument()
    expect(
      screen.getByText('Go back to request an API.'),
    ).toBeInTheDocument()
  })

  it('gọi onClickRow khi click row', async () => {
    const onClickRow = jest.fn()
    render(<TableView table={mockTable() as any} onClickRow={onClickRow} />)
    await userEvent.click(screen.getByText('A'))
    expect(onClickRow).toHaveBeenCalledWith({ name: 'A' })
  })

  it('render header placeholder, sort indicator và selected state', async () => {
    const table = mockTable({
      selectable: true,
      sortable: true,
      withPlaceholderHeader: true,
    })

    render(<TableView table={table as any} header />)

    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.queryByText('Ignored')).not.toBeInTheDocument()
    expect(screen.getAllByTestId('sort-indicator')[0]).toHaveTextContent('true:asc')
    expect(screen.getByText('A').closest('tr')).toHaveAttribute('data-state', 'selected')

    await userEvent.click(screen.getByText('Name'))
    expect(table.toggleSortingHandler).toHaveBeenCalledTimes(1)
  })

  it('không lỗi khi click row mà không truyền onClickRow', async () => {
    render(<TableView table={mockTable() as any} />)

    await userEvent.click(screen.getByText('A'))

    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('render pagination khi pageCount > 1', async () => {
    const table = mockTableWithPagination()
    render(<TableView table={table as any} />)

    const paginationBtn = screen.getByTestId('pagination')
    expect(paginationBtn).toHaveAttribute('data-current', '1')
    expect(paginationBtn).toHaveAttribute('data-total', '2')

    await userEvent.click(paginationBtn)
    expect(table.setPageIndex).toHaveBeenCalledWith(1) // onPageChange(2) => setPageIndex(2 - 1)
  })

  it('render empty action button khi emptyButtonOnClick được truyền', async () => {
    const onClick = jest.fn()
    render(
      <TableView
        table={mockTableEmpty() as any}
        emptyButtonOnClick={onClick}
        emptyButtonTitle="Create"
      />
    )

    await userEvent.click(screen.getByRole('button', { name: 'Create' }))
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('hiển thị sort indicator undefined khi cột chưa được sort', async () => {
    const table = mockTable({ sortable: true, isSortedValue: false })
    render(<TableView table={table as any} header />)

    expect(screen.getAllByTestId('sort-indicator')[0]).toHaveTextContent('true:undefined')
  })

  it('dùng emptyButtonTitle mặc định khi không truyền emptyButtonTitle', async () => {
    const onClick = jest.fn()
    render(<TableView table={mockTableEmpty() as any} emptyButtonOnClick={onClick} />)

    await userEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledTimes(1)
  })
})