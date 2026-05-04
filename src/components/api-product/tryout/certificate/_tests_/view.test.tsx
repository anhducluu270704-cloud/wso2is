import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'

const mockNotFound = jest.fn(() => null)

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/share/ui/spinner', () => ({
  SpinnerCustom: () => <div data-testid="spinner" />,
}))

const mockUseGenrateCertifiate = jest.fn()

jest.mock('@/services/scenario/scenario.query-options', () => ({
  useGenrateCertifiate: (...a: unknown[]) => mockUseGenrateCertifiate(...a),
}))

jest.mock('react-pdf', () => {
  const React = require('react')
  const pdfjs = { GlobalWorkerOptions: { workerSrc: '' } }
  function MockDocument({
    children,
    onLoadSuccess,
    onLoadError,
  }: {
    children?: React.ReactNode
    onLoadSuccess?: (args: { numPages: number }) => void
    onLoadError?: () => void
  }) {
    React.useEffect(() => {
      onLoadSuccess?.({ numPages: 1 })
    }, [onLoadSuccess, onLoadError])
    return <div data-testid="pdf-doc">{children}</div>
  }
  function MockPage() {
    return <div data-testid="pdf-page" />
  }
  return { pdfjs, Document: MockDocument, Page: MockPage }
})

import { CertificateView } from '../view'

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver
  global.URL.createObjectURL = jest.fn(() => 'blob:mock-url')
  global.URL.revokeObjectURL = jest.fn()
})

describe('CertificateView', () => {
  beforeEach(() => {
    mockNotFound.mockClear()
    mockUseGenrateCertifiate.mockReset()
  })

  it('spinner khi đang tải blob', () => {
    mockUseGenrateCertifiate.mockReturnValue({
      isLoading: true,
      isError: false,
      isSuccess: false,
    })
    render(<CertificateView cert_id="c1" />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })

  it('notFound khi lỗi query', () => {
    mockUseGenrateCertifiate.mockReturnValue({
      isLoading: false,
      isError: true,
      isSuccess: false,
    })
    render(<CertificateView cert_id="c1" />)
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('notFound khi success nhưng không phải Blob', () => {
    mockUseGenrateCertifiate.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: { not: 'blob' },
    })
    render(<CertificateView cert_id="c1" />)
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('render PDF và link tải khi có Blob hợp lệ', async () => {
    const blob = new Blob(['%PDF'], { type: 'application/pdf' })
    mockUseGenrateCertifiate.mockReturnValue({
      isLoading: false,
      isError: false,
      isSuccess: true,
      data: blob,
    })
    render(<CertificateView cert_id="cid-1" />)
    await waitFor(() => {
      expect(screen.getByTestId('pdf-doc')).toBeInTheDocument()
    })
    expect(screen.getByTestId('pdf-page')).toBeInTheDocument()
    const link = screen.getByRole('link', { name: /btn.download/i })
    expect(link).toHaveAttribute('href', 'blob:mock-url')
    expect(link).toHaveAttribute('download', 'sandbox-certificate-cid-1.pdf')
  })
})
