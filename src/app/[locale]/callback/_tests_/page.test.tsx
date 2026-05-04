
import React from 'react'
import { render, screen } from '@testing-library/react'

const mockNotFound = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@/components/auth/call-back', () => ({
  __esModule: true,
  default: ({ token }: { token: string }) => (
    <div>{`CallbackWrapper:${token}`}</div>
  ),
}))

describe('app/[locale]/callback/page', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
  })

  it('exports metadata with fixed title', async () => {
    const { metadata } = await import('../page')

    expect(metadata.title).toBe('Callback')
    expect(metadata.description).toBe('')
  })

  it('calls notFound when token search param is missing', async () => {
    const { default: CallbackPage } = await import('../page')

    const element = await CallbackPage({
      searchParams: Promise.resolve({}),
    } as any)

    expect(mockNotFound).toHaveBeenCalled()
    expect(element).toBeUndefined()
  })

  it('calls notFound when token is empty or whitespace only', async () => {
    const { default: CallbackPage } = await import('../page')

    await CallbackPage({
      searchParams: Promise.resolve({ token: '' }),
    } as any)
    expect(mockNotFound).toHaveBeenCalledTimes(1)

    mockNotFound.mockClear()

    await CallbackPage({
      searchParams: Promise.resolve({ token: '   \t  ' }),
    } as any)
    expect(mockNotFound).toHaveBeenCalledTimes(1)
  })

  it('renders CallbackWrapper with trimmed token', async () => {
    const { default: CallbackPage } = await import('../page')

    const element = await CallbackPage({
      searchParams: Promise.resolve({ token: '  tok-1  ' }),
    } as any)

    render(element)

    expect(screen.getByText('CallbackWrapper:tok-1')).toBeInTheDocument()
    expect(mockNotFound).not.toHaveBeenCalled()
  })
})
