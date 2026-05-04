
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Empty,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
} from '@/share/ui/empty'

describe('share/ui/empty', () => {
  it('render Empty với EmptyTitle, EmptyDescription', () => {
    render(
      <Empty>
        <EmptyTitle>No data</EmptyTitle>
        <EmptyDescription>Description</EmptyDescription>
      </Empty>
    )
    expect(screen.getByText('No data')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })
  it('render EmptyContent', () => {
    render(
      <Empty>
        <EmptyContent>Content</EmptyContent>
      </Empty>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('render EmptyHeader', () => {
    render(
      <Empty>
        <EmptyHeader>
          <EmptyTitle>Header</EmptyTitle>
        </EmptyHeader>
      </Empty>
    )
    expect(screen.getByText('Header')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="empty-header"]')).toBeInTheDocument()
  })
  it('render EmptyMedia với variant default', () => {
    render(
      <Empty>
        <EmptyMedia data-testid="empty-media">Icon</EmptyMedia>
      </Empty>
    )
    expect(screen.getByTestId('empty-media')).toBeInTheDocument()
    expect(document.querySelector('[data-variant="default"]')).toBeInTheDocument()
  })
  it('render EmptyMedia với variant icon', () => {
    render(
      <Empty>
        <EmptyMedia variant="icon" data-testid="empty-media-icon">
          Icon
        </EmptyMedia>
      </Empty>
    )
    expect(screen.getByTestId('empty-media-icon')).toBeInTheDocument()
    expect(document.querySelector('[data-variant="icon"]')).toBeInTheDocument()
  })
})