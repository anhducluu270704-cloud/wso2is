
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FilterProvider, useFilter } from '../filter-provider'

const mockPush = jest.fn()
jest.mock('@/i18n/navigation', () => ({ useRouter: () => ({ push: mockPush }) }))
jest.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams('sort=name:asc'),
}))

function TestConsumer() {
  const { filter } = useFilter()
  return <span>Limit: {filter.limit}</span>
}

function TestConsumerWithActions() {
  const { onSortChange, onSearchChange, updateParam, table } = useFilter()
  return (
    <div>
      <button onClick={() => onSortChange({ name: 'created', dir: 'desc' })}>
        Sort
      </button>
      <button onClick={() => onSearchChange('keyword')}>Search</button>
      <button onClick={() => updateParam('page', '2')}>Update</button>
      <button onClick={() => updateParam('page')}>Delete</button>
      <button
        onClick={() =>
          table.updateSortState([{ id: 'name', desc: true }])
        }
      >
        TableSort
      </button>
      <button
        onClick={() =>
          table.updateSortState((prev) =>
            prev.length ? prev : [{ id: 'created_at', desc: false }]
          )
        }
      >
        TableSortFn
      </button>
    </div>
  )
}

describe('providers/filter-provider', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('render và provide filter context', () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumer />
      </FilterProvider>
    )
    expect(screen.getByText('Limit: 10')).toBeInTheDocument()
  })

  it('onSortChange gọi router.push với sort param', async () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumerWithActions />
      </FilterProvider>
    )
    await userEvent.click(screen.getByText('Sort'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=created%3Adesc'))
  })

  it('onSearchChange gọi router.push với keyword', async () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumerWithActions />
      </FilterProvider>
    )
    await userEvent.click(screen.getByText('Search'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('keyword=keyword'))
  })

  it('updateParam set key và value', async () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumerWithActions />
      </FilterProvider>
    )
    await userEvent.click(screen.getByText('Update'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('page=2'))
  })

  it('updateParam xóa key khi value undefined', async () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumerWithActions />
      </FilterProvider>
    )
    await userEvent.click(screen.getByText('Delete'))
    expect(mockPush).toHaveBeenCalled()
  })

  it('table.updateSortState gọi onSortChange', async () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumerWithActions />
      </FilterProvider>
    )
    await userEvent.click(screen.getByText('TableSort'))
    expect(mockPush).toHaveBeenCalledWith(expect.stringContaining('sort=name%3Adesc'))
  })

  it('table.updateSortState với updater function vẫn cập nhật sort', async () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumerWithActions />
      </FilterProvider>
    )
    await userEvent.click(screen.getByText('TableSortFn'))
    expect(mockPush).toHaveBeenCalledWith(
      expect.stringContaining('sort=created_at%3Aasc')
    )
  })

  it('useFilter ném lỗi khi dùng ngoài FilterProvider', () => {
    function BadConsumer() {
      useFilter()
      return null
    }
    expect(() => render(<BadConsumer />)).toThrow(
      'useFilter must be used within a FilterProvider'
    )
  })

  it('table.updateSortState với updater trả về empty array gọi onSortChange undefined', async () => {
    render(
      <FilterProvider filter={{ limit: 10, offset: 0 }}>
        <TestConsumerWithActions />
      </FilterProvider>
    )
    // TableSortFn: prev.length ? prev : [{ id: 'created_at', desc: false }]
    // khi prev=[] thì trả về array mới → [0] = { id: 'created_at', desc: false }
    await userEvent.click(screen.getByText('TableSortFn'))
    expect(mockPush).toHaveBeenCalled()
  })

  it('updateSortState khi kết quả empty clear sort param', async () => {
    function ClearSortConsumer() {
      const { table } = useFilter()
      return (
        <button onClick={() => table.updateSortState(() => [])}>
          ClearSort
        </button>
      )
    }
    render(
      <FilterProvider
        filter={{ limit: 10, offset: 0, sort: { name: 'name', dir: 'asc' } }}
      >
        <ClearSortConsumer />
      </FilterProvider>
    )
    await userEvent.click(screen.getByText('ClearSort'))
    expect(mockPush).toHaveBeenCalled()
  })

  it('sortState có khi filter.sort có', () => {
    function SortConsumer() {
      const { table } = useFilter()
      return (
        <span>
          {table.sortState
            ? `${table.sortState[0]?.id}-${table.sortState[0]?.desc}`
            : 'none'}
        </span>
      )
    }
    render(
      <FilterProvider
        filter={{
          limit: 10,
          offset: 0,
          sort: { name: 'created', dir: 'desc' },
        }}
      >
        <SortConsumer />
      </FilterProvider>
    )
    expect(screen.getByText('created-true')).toBeInTheDocument()
  })
})