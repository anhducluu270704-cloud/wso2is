
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TableView } from '@/share/components/table'

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/share/icons', () => ({
  Empty: () => <div>EmptyIcon</div>,
}))
jest.mock('@/share/ui/empty', () => ({
  Empty: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  EmptyHeader: ({ children }: any) => <div>{children}</div>,
  EmptyContent: ({ children }: any) => <div>{children}</div>,
  EmptyTitle: ({ children }: any) => <div>{children}</div>,
}))
jest.mock('@/share/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children, onClick, ...props }: any) => (
    <tr onClick={onClick} {...props}>
      {children}
    </tr>
  ),
  TableHead: ({ children, onClick, endIcon }: any) => (
    <th onClick={onClick}>
      {children}
      {endIcon}
    </th>
  ),
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableSortCol: ({ isShow }: { isShow: boolean }) =>
    isShow ? <span>Sort</span> : null,
}))

function mockTableWithRows() {
  return {
    getHeaderGroups: () => [
      {
        id: '1',
        headers: [
          {
            id: 'target',
            column: {
              columnDef: { header: 'Endpoint' },
              getCanSort: () => false,
              getToggleSortingHandler: () => undefined,
              getIsSorted: () => false,
            },
            isPlaceholder: false,
            getContext: () => ({}),
            getValue: () => '',
          },
          {
            id: 'verb',
            column: {
              columnDef: { header: 'Method' },
              getCanSort: () => false,
              getToggleSortingHandler: () => undefined,
              getIsSorted: () => false,
            },
            isPlaceholder: false,
            getContext: () => ({}),
            getValue: () => '',
          },
        ],
      },
    ],
    getRowModel: () => ({
      rows: [
        {
          id: '1',
          original: {},
          getIsSelected: () => false,
          getVisibleCells: () => [
            {
              id: 't1',
              column: { columnDef: { cell: () => 'GET' } },
              getContext: () => ({}),
            },
            {
              id: 'v1',
              column: { columnDef: { cell: () => '/pay' } },
              getContext: () => ({}),
            },
          ],
        },
      ],
    }),
    getAllColumns: () => [],
    getPageCount: () => 1,
    setPageIndex: jest.fn(),
    getState: () => ({ pagination: { pageIndex: 0 } }),
  }
}

function mockTableEmpty() {
  const col = {
    getCanSort: () => false,
    getToggleSortingHandler: () => undefined,
    getIsSorted: () => false,
    columnDef: { header: 'Col' },
  }
  return {
    getHeaderGroups: () => [
      {
        id: '1',
        headers: [
          {
            id: 'col',
            column: col,
            isPlaceholder: false,
            getContext: () => ({}),
            getValue: () => '',
          },
        ],
      },
    ],
    getRowModel: () => ({ rows: [] }),
    getAllColumns: () => [],
    getPageCount: () => 1,
    setPageIndex: jest.fn(),
    getState: () => ({ pagination: { pageIndex: 0 } }),
  }
}

function mockTableSortable() {
  const toggleSort = jest.fn()
  return {
    toggleSort,
    table: {
      getHeaderGroups: () => [
        {
          id: 'sortable',
          headers: [
            {
              id: 'placeholder',
              column: {
                columnDef: { header: 'Ignored' },
                getCanSort: () => false,
                getToggleSortingHandler: () => undefined,
                getIsSorted: () => false,
              },
              isPlaceholder: true,
              getContext: () => ({}),
            },
            {
              id: 'sortable-header',
              column: {
                columnDef: { header: 'Sortable' },
                getCanSort: () => true,
                getToggleSortingHandler: () => toggleSort,
                getIsSorted: () => 'asc',
              },
              isPlaceholder: false,
              getContext: () => ({}),
            },
          ],
        },
      ],
      getRowModel: () => ({
        rows: [
          {
            id: 'row-1',
            original: { id: 1 },
            getIsSelected: () => true,
            getVisibleCells: () => [
              {
                id: 'cell-1',
                column: { columnDef: { cell: () => 'Selected row' } },
                getContext: () => ({}),
              },
            ],
          },
          {
            id: 'row-2',
            original: { id: 2 },
            getIsSelected: () => false,
            getVisibleCells: () => [
              {
                id: 'cell-2',
                column: { columnDef: { cell: () => 'Second row' } },
                getContext: () => ({}),
              },
            ],
          },
        ],
      }),
      getAllColumns: () => [],
      getPageCount: () => 1,
      setPageIndex: jest.fn(),
      getState: () => ({ pagination: { pageIndex: 0 } }),
    },
  }
}

describe('api-product/detail/about/table/table-view', () => {
  it('render TableView với rows', () => {
    render(<TableView table={mockTableWithRows() as any} />)
    expect(document.querySelector('table')).toBeInTheDocument()
  })

  it('gọi onClickRow khi click row', async () => {
    const onClickRow = jest.fn()
    const table = mockTableWithRows()
    render(<TableView table={table as any} onClickRow={onClickRow} />)
    const row = screen.getByText('GET').closest('tr')
    if (row) await userEvent.click(row)
    expect(onClickRow).toHaveBeenCalled()
  })

  it('render no_results khi không có rows', () => {
    render(<TableView table={mockTableEmpty() as any} />)
    expect(screen.getByText('table.empty')).toBeInTheDocument()
  })

  it('render sortable header và row selected, click header/row không lỗi', async () => {
    const { table, toggleSort } = mockTableSortable()

    render(<TableView table={table as any} header />)

    await userEvent.click(screen.getByText('Sortable'))
    await userEvent.click(screen.getByText('Selected row').closest('tr')!)

    expect(toggleSort).toHaveBeenCalled()
    expect(screen.getByText('Sort')).toBeInTheDocument()
    expect(screen.getByText('Selected row').closest('tr')).toHaveAttribute(
      'data-state',
      'selected'
    )
    expect(screen.getByText('Second row').closest('tr')).toHaveClass('bg-white')
  })
})
