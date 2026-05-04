import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl/server', () => ({
  getTranslations: () =>
    Promise.resolve((key: string) => `layout.${key}`),
}))

const mockNotFound = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('@/components/regTicket/create', () => ({
  __esModule: true,
  default: (p: Record<string, string>) => (
    <div data-testid="create-wrapper">
      {p.scenario_id}-{p.api_id}
    </div>
  ),
}))

jest.mock('@/components/regTicket/status', () => ({
  __esModule: true,
  default: () => <div data-testid="cert-status" />,
}))

describe('CreateRegTicketPage', () => {
  beforeEach(() => {
    mockNotFound.mockReset()
    mockNotFound.mockReturnValue(<div data-testid="nf">nf</div>)
  })

  it('generateMetadata', async () => {
    const { generateMetadata } = await import('../page')
    const m = await generateMetadata()
    expect(m.title).toBe('layout.header.reg_ticket')
  })

  it('CertificateStatus khi có ticket_id', async () => {
    const { default: Page } = await import('../page')
    const el = await Page({
      searchParams: Promise.resolve({
        ticket_id: 't1',
        scenario_id: '',
        version_id: '',
        application_id: '',
        api_id: '',
      }),
    } as any)
    render(el)
    expect(screen.getByTestId('cert-status')).toBeInTheDocument()
  })

  it('notFound khi thiếu tham số bắt buộc', async () => {
    const { default: Page } = await import('../page')
    await Page({
      searchParams: Promise.resolve({
        scenario_id: 's',
        version_id: '',
        application_id: 'a',
        api_id: 'api',
        ticket_id: '',
      }),
    } as any)
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('CreateRegTicketWrapper khi đủ param', async () => {
    const { default: Page } = await import('../page')
    const el = await Page({
      searchParams: Promise.resolve({
        scenario_id: 's1',
        version_id: 'v1',
        application_id: 'app1',
        api_id: 'api1',
        ticket_id: '',
      }),
    } as any)
    render(el)
    expect(screen.getByTestId('create-wrapper')).toHaveTextContent('s1-api1')
  })
})
