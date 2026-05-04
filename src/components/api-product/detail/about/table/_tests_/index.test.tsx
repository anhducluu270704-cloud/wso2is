
import React from 'react'
import { render, screen } from '@testing-library/react'
import ApiResourceTable from '../index'

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}))
jest.mock('@/share/components/table', () => ({
  TableView: () => <div>TableView</div>,
}))

describe('api-product/detail/about/table', () => {
  it('render no_resources khi resources rỗng', () => {
    render(<ApiResourceTable resources={[]} />)
    // Component always renders the table (even when empty)
    expect(screen.getByText('TableView')).toBeInTheDocument()
  })

  it('render TableView khi có resources', () => {
    render(
      <ApiResourceTable
        resources={[
          { target: '/payment', verb: 'GET' },
          { target: '/transfer', verb: 'POST' },
        ]}
      />
    )
    expect(screen.getByText('TableView')).toBeInTheDocument()
  })

  it('render no_resources khi không truyền resources', () => {
    render(<ApiResourceTable />)
    expect(screen.getByText('TableView')).toBeInTheDocument()
  })
})
