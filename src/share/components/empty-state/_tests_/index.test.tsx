
import React from 'react'
import { render, screen } from '@testing-library/react'
import EmptyState from '../index'

jest.mock('@/share/icons', () => ({ Empty: () => <span>EmptyIcon</span> }))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) => (
    <button onClick={onClick}>{children}</button>
  ),
}))

describe('share/components/empty-state', () => {
  it('render với title và buttonTitle', () => {
    render(
      <EmptyState
        header="Header"
        title="No data"
        buttonTitle="Create"
        onClick={jest.fn()}
      />
    )
    expect(screen.getByText('No data')).toBeInTheDocument()
    expect(screen.getByText('Create')).toBeInTheDocument()
  })
})