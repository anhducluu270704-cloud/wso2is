
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, jest } from '@jest/globals'

jest.mock('next-intl/server', () => ({
  getTranslations: (ns: string) => Promise.resolve((key: string) => `${ns}.${key}`),
}))

jest.mock('@/components/application/detail', () => ({
  __esModule: true,
  default: ({
    app_id,
    api_product_name,
  }: {
    app_id: string
    api_product_name: string
  }) => (
    <div>
      {`ApplicationDetail:${app_id}:${api_product_name}`}
    </div>
  ),
}))

describe('ApplicationDetailPage module', () => {
  it('generateMetadata uses layout translations', async () => {
    const { generateMetadata } = await import('../page')

    const metadata = await generateMetadata()
    expect(metadata.title).toBe('layout.header.application')
    expect(metadata.description).toBe('')
  })

  it('renders ApplicationDetail and OverviewSection with correct ids', async () => {
    const { default: ApplicationDetailPage } = await import('../page')

    const element = await ApplicationDetailPage({
      params: Promise.resolve({
        app_id: 'app-1',
      }),
      searchParams: Promise.resolve({
        api_product_name: 'api-1',
      }),
    } as any)

    render(element)

    expect(
      screen.getByText('ApplicationDetail:app-1:api-1'),
    ).toBeTruthy()
  })

  it('truyền api_product_name từ searchParams xuống wrapper', async () => {
    const { default: ApplicationDetailPage } = await import('../page')

    const element = await ApplicationDetailPage({
      params: Promise.resolve({
        app_id: 'app-2',
      }),
      searchParams: Promise.resolve({
        api_product_name: 'My API',
      }),
    } as any)

    render(element)

    expect(
      screen.getByText('ApplicationDetail:app-2:My API'),
    ).toBeTruthy()
  })
})

