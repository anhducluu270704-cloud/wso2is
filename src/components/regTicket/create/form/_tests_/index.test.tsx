import React from 'react'
import { render, screen } from '@testing-library/react'

const mockNotFound = jest.fn(() => null)

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/providers/auth-session-provider', () => ({
  useAuthSession: jest.fn(),
}))

jest.mock('@/share/components/form', () => ({
  __esModule: true,
  default: ({
    children,
    onSubmit,
  }: {
    children: React.ReactNode
    onSubmit: (e: React.FormEvent) => void
  }) => (
    <form
      data-testid="container-form"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit(e)
      }}
    >
      {children}
    </form>
  ),
}))

jest.mock('@/share/components/input', () => ({
  __esModule: true,
  default: () => <div data-testid="input-stub" />,
}))

jest.mock('@/share/components/input/textarea', () => ({
  __esModule: true,
  default: () => <div data-testid="textarea-stub" />,
}))

jest.mock('@/share/icons/file.svg', () => ({
  __esModule: true,
  default: () => <span data-testid="file-icon" />,
}))

const mockOnSubmit = jest.fn()
const mockHandleSubmit = jest.fn((fn: () => void) => () => fn())

jest.mock('../hook', () => ({
  useRegTicketForm: () => ({
    regTicketForm: {
      handleSubmit: mockHandleSubmit,
      register: () => ({}) as any,
      formState: { errors: {} },
    },
    onSubmit: mockOnSubmit,
  }),
}))

import RegTicketForm from '../index'

const cert = {
  id: 'cid',
  certificateNumber: 'n',
  scenarioName: 's',
  apiName: 'APIX',
  apiId: 'aid',
  applicationId: 'apid',
  issueDate: 'd',
  status: 'ACTIVE' as const,
}

describe('RegTicketForm', () => {
  const { useAuthSession } = jest.requireMock(
    '@/providers/auth-session-provider',
  )

  beforeEach(() => {
    mockNotFound.mockClear()
    mockOnSubmit.mockClear()
    mockHandleSubmit.mockImplementation((fn: () => void) => () => fn())
  })

  it('gọi notFound khi không có authSession', () => {
    useAuthSession.mockReturnValue({ authSession: null })
    render(<RegTicketForm scenarioCertificate={cert} />)
    expect(mockNotFound).toHaveBeenCalled()
  })

  it('render form khi có session', () => {
    useAuthSession.mockReturnValue({
      authSession: {
        user_info: {
          fullName: 'A',
          emails: 'a@b.c',
          phoneNumbers: '1',
          taxcode: 't',
          companyName: 'C',
          businessSector: 'B',
        },
      },
    })
    render(<RegTicketForm scenarioCertificate={cert} />)
    expect(screen.getByTestId('container-form')).toBeInTheDocument()
    expect(screen.getByText('APIX')).toBeInTheDocument()
    expect(screen.getByText('btn.create')).toBeInTheDocument()
  })
})
