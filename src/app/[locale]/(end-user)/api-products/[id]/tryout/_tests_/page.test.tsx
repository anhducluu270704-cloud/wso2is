import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, jest } from '@jest/globals'

jest.mock('next-intl/server', () => ({
  getTranslations: () =>
    Promise.resolve((key: string) => `layout.${key}`),
}))

const mockNotFound = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@/components/api-product/tryout', () => ({
  __esModule: true,
  default: ({
    api_id,
    app_id,
    case_id,
  }: {
    api_id: string
    app_id: string
    case_id: string
  }) => (
    <div>
      Tryout:{api_id}:{app_id}:{case_id ?? ''}
    </div>
  ),
}))

describe('ApiProductTryoutPage', () => {
  beforeEach(() => {
    mockNotFound.mockReturnValue(<div data-testid="nf">nf</div>)
  })

  it('generateMetadata', async () => {
    const { generateMetadata } = await import('../page')
    const m = await generateMetadata()
    expect(m.title).toBe('layout.header.tryout')
  })

  it('notFound khi thiếu id hoặc app_id', async () => {
    const { default: Page } = await import('../page')
    mockNotFound.mockClear()

    await Page({
      params: Promise.resolve({ id: '' }),
      searchParams: Promise.resolve({ app_id: 'a', case_id: '' }),
    } as any)

    expect(mockNotFound).toHaveBeenCalled()
  })

  it('render wrapper với params hợp lệ', async () => {
    const { default: Page } = await import('../page')
    const el = await Page({
      params: Promise.resolve({ id: 'api-x' }),
      searchParams: Promise.resolve({ app_id: 'app-y', case_id: 'c1' }),
    } as any)

    render(el)
    expect(
      screen.getByText('Tryout:api-x:app-y:c1'),
    ).toBeInTheDocument()
  })
})
