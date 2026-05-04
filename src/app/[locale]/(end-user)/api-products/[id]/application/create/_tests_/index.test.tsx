
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl/server', () => ({
  getTranslations: (ns: string) => Promise.resolve((key: string) => `${ns}.${key}`),
}))

const mockNotFound = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@/components/application/create', () => ({
  __esModule: true,
  default: () => <div>CreateApplicationWrapper</div>,
}))

describe('CreateApplicationPage module', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
  })

  it('generateMetadata uses layout translations', async () => {
    const { generateMetadata } = await import('../page')

    const metadata = await generateMetadata()
    expect(metadata.title).toBe('layout.header.application')
    expect(metadata.description).toBe('')
  })

  it('renders CreateApplicationWrapper', async () => {
    const { default: CreateApplicationPage } = await import('../page')

    const element = await CreateApplicationPage({
      searchParams: Promise.resolve({ callback: '/en/api-products/api-1' }),
    } as any)

    render(element)
    expect(screen.getByText('CreateApplicationWrapper')).toBeInTheDocument()
    expect(mockNotFound).not.toHaveBeenCalled()
  })
})

