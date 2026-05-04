
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
  TableSortCol,
} from '@/share/ui/table'

jest.mock('@/share/icons', () => ({
  ArrowUp: () => <span data-testid="arrow-up" />,
  ArrowDown: () => <span data-testid="arrow-down" />,
  ArrowUpDown: () => <span data-testid="arrow-up-down" />,
}))

describe('share/ui/table', () => {
  it('render Table với header và row', () => {
    render(
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Value</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    )
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Value')).toBeInTheDocument()
  })

  it('render footer, caption và icon trong cell/head', () => {
    render(
      <Table>
        <TableCaption>Caption</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead endIcon={<span data-testid="head-icon" />}>Name</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Header cell</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    )

    expect(screen.getByText('Caption')).toBeInTheDocument()
    expect(screen.getByText('Header cell').closest('td')).toBeInTheDocument()
    expect(screen.getByTestId('head-icon')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
  })

  it('render TableSortCol theo trạng thái sort', () => {
    const { rerender } = render(<TableSortCol isShow sort="asc" />)
    expect(screen.getByTestId('arrow-up')).toBeInTheDocument()

    rerender(<TableSortCol isShow sort="desc" />)
    expect(screen.getByTestId('arrow-down')).toBeInTheDocument()

    rerender(<TableSortCol isShow />)
    expect(screen.getByTestId('arrow-up-down')).toBeInTheDocument()

    rerender(<TableSortCol isShow={false} />)
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument()
    expect(screen.queryByTestId('arrow-down')).not.toBeInTheDocument()
    expect(screen.queryByTestId('arrow-up-down')).not.toBeInTheDocument()
  })
})