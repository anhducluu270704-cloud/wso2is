
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
  CardAction,
} from '@/share/ui/card'

describe('share/ui/card', () => {
  it('render Card và CardContent', () => {
    render(
      <Card>
        <CardContent>Content</CardContent>
      </Card>
    )
    expect(screen.getByText('Content')).toBeInTheDocument()
  })
  it('render CardHeader và CardTitle', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Title')).toBeInTheDocument()
  })
  it('render CardFooter', () => {
    render(
      <Card>
        <CardFooter>Footer</CardFooter>
      </Card>
    )
    expect(screen.getByText('Footer')).toBeInTheDocument()
  })
  it('render CardDescription', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description text</CardDescription>
        </CardHeader>
      </Card>
    )
    expect(screen.getByText('Description text')).toBeInTheDocument()
  })
  it('render CardAction', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardAction>
            <button type="button">Action</button>
          </CardAction>
        </CardHeader>
      </Card>
    )
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
  it('render Card với size sm, lg, xl', () => {
    const { rerender } = render(<Card size="sm">Content</Card>)
    expect(document.querySelector('[data-size="sm"]')).toBeInTheDocument()

    rerender(<Card size="lg">Content</Card>)
    expect(document.querySelector('[data-size="lg"]')).toBeInTheDocument()

    rerender(<Card size="xl">Content</Card>)
    expect(document.querySelector('[data-size="xl"]')).toBeInTheDocument()
  })
})