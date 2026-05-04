import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/share/components/empty-state', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}))

jest.mock('../view', () => ({
  CertificateView: ({ cert_id }: { cert_id: string }) => (
    <div data-testid="cert-view">{cert_id}</div>
  ),
}))

import TryoutCertificate from '../index'

const certificateStub = {
  id: 'cert-99',
  certificateNumber: 'n',
  scenarioName: 's',
  apiName: 'a',
  apiId: 'api-1',
  applicationId: 'app-1',
  issueDate: '2024-01-01',
  status: 'ACTIVE' as const,
}

describe('TryoutCertificate', () => {
  it('empty state khi chưa có certificate', () => {
    render(<TryoutCertificate certificate={null} />)
    expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    expect(screen.getByText('empty.certificate.title')).toBeInTheDocument()
  })

  it('empty state khi certificate là undefined', () => {
    render(<TryoutCertificate />)
    expect(screen.getByText('empty.certificate.title')).toBeInTheDocument()
  })

  it('hiển thị CertificateView khi có certificate', () => {
    render(<TryoutCertificate certificate={certificateStub} />)
    expect(screen.getByTestId('cert-view')).toHaveTextContent('cert-99')
  })
})
