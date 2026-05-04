
import React from 'react'
import { render, screen } from '@testing-library/react'
import { NewsSectionWrapper } from '../index'

jest.mock('../card', () => ({
  NewsSectionCard: () => null,
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), back: jest.fn() }),
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, linked, rounded, variant, size, ...props }: any) => (
    <button {...props}>{children}</button>
  ),
}))

describe('components/news/container', () => {
  it('renders title, see all label, and children', () => {
    render(
      <NewsSectionWrapper title="Success stories" seeAllLabel="All">
        <div>Children</div>
      </NewsSectionWrapper>
    )

    expect(screen.getByText('Success stories')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
    expect(screen.getByText('Children')).toBeInTheDocument()
  })

  it('adds grey background when background=grey-11', () => {
    const { container } = render(
      <NewsSectionWrapper title="X" background="grey-11">
        <div />
      </NewsSectionWrapper>
    )
    expect(container.firstChild).toHaveClass('bg-grey-11')
  })
})

