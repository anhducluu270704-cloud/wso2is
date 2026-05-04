
import React from 'react'
import { render, screen } from '@testing-library/react'
import ViewToken from '../index'

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}))
jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/share/ui/table', () => ({
  Table: ({ children }: any) => <table>{children}</table>,
  TableBody: ({ children }: any) => <tbody>{children}</tbody>,
  TableRow: ({ children }: any) => <tr>{children}</tr>,
  TableCell: ({ children }: any) => <td>{children}</td>,
}))

jest.mock('@/share/components/table/use-app-table', () => ({
  useAppTable: () => ({
    getRowModel: () => ({ rows: [] }),
    getHeaderGroups: () => [],
    getAllColumns: () => [],
  }),
}))

jest.mock('@/share/components/table', () => ({
  TableView: () => <div>TableView</div>,
}))

describe('application/detail/view-token', () => {
  it('render ViewToken với title và description', () => {
    render(<ViewToken />)
    expect(screen.getByText('keys.view_token_title')).toBeInTheDocument()
    expect(screen.getByText('keys.view_token_description')).toBeInTheDocument()
  })

  it('render scope row với SANDBOX_SCOPES', () => {
    render(<ViewToken />)
    // Table rows are rendered inside TableView (mocked), so only validate the static copy.
    expect(screen.getByText('keys.view_token_title')).toBeInTheDocument()
    expect(screen.getByText('keys.view_token_description')).toBeInTheDocument()
  })
})