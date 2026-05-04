
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, jest } from '@jest/globals'

jest.mock('next-intl/server', () => ({
  getTranslations: (ns: string) => Promise.resolve((key: string) => `${ns}.${key}`),
}))

jest.mock('@/components/api-product/detail', () => ({
  __esModule: true,
  default: ({ id }: { id: string }) => <div>ApiProductDetailWrapper:{id}</div>,
}))
jest.mock('@/providers/filter-provider', () => ({
  FilterProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}))

describe('ApiProductDetailPage module', () => {
  it('generateMetadata uses layout translations', async () => {
    const { generateMetadata } = await import('../page')

    const metadata = await generateMetadata()
    expect(metadata.title).toBe('layout.header.apiproducts')
    expect(metadata.description).toBe('')
  })

  it('renders ApiProductDetailWrapper with id from params', async () => {
    const { default: ApiProductDetailPage } = await import('../page')

    const element = await ApiProductDetailPage({
      params: Promise.resolve({ id: '123' }),
      searchParams: Promise.resolve({ inlinetoasttype: '', inlinetoastmsgkey: '' }),
    } as any)

    render(element)

    expect(screen.getByText('ApiProductDetailWrapper:123')).toBeTruthy()
  })
})

