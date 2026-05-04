
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('@/components/auth/get-token', () => ({
  __esModule: true,
  default: ({ code }: { code: string }) => <div>{`GetTokenWrapper:${code}`}</div>,
}))

describe('GetTokenPage module', () => {
  it('exports metadata with fixed title', async () => {
    const { metadata } = await import('../page')

    expect(metadata.title).toBe('Get Token')
    expect(metadata.description).toBe('')
  })

  it('calls notFound when code search param is missing', async () => {
    const { default: GetTokenPage } = await import('../page')
    const { notFound } = await import('next/navigation')

    const element = await GetTokenPage({
      searchParams: Promise.resolve({}),
    } as any)

    expect(notFound).toHaveBeenCalled()
    expect(element).toBeUndefined()
  })

  it('renders GetTokenWrapper when code is present', async () => {
    const { default: GetTokenPage } = await import('../page')

    const element = await GetTokenPage({
      searchParams: Promise.resolve({ code: 'abc123' }),
    } as any)

    render(element)

    expect(
      screen.getByText('GetTokenWrapper:abc123')
    ).toBeInTheDocument()
  })
})

