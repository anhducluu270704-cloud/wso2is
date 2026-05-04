
import React from 'react'
import { render, screen } from '@testing-library/react'
import TableSkeleton from '../skeleton'

jest.mock('@/share/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableCell: ({ children }: any) => <td>{children}</td>,
  TableHead: ({ children }: any) => <th>{children}</th>,
  TableHeader: ({ children }: any) => <thead>{children}</thead>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
}))
jest.mock('@/share/ui/skeleton', () => ({
  Skeleton: () => <div data-testid="skeleton" />,
}))

describe('share/components/table/skeleton', () => {
  it('render TableSkeleton với header và body rows', () => {
    render(<TableSkeleton />)
    expect(document.querySelector('table')).toBeInTheDocument()
    expect(screen.getAllByTestId('skeleton').length).toBeGreaterThan(0)
  })
})
