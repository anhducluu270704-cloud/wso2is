import { renderHook } from '@testing-library/react'

import { useRegTicketForm } from '../hook'

const mockMutate = jest.fn()

jest.mock('@/services/reg-ticket/regTicket.mutations', () => ({
  useCreateRegTicketMutation: () => ({ mutate: mockMutate }),
}))

const authSession = {
  fullName: 'FN',
  emails: 'e@m.com',
  phoneNumbers: '091',
  taxcode: 't',
  companyName: 'Co',
  businessSector: 'Sec',
  companyAddress: '123 Nguyen Trai, Q1',
  representativeName: 'RN',
  representativeMobile: '092',
  representativeEmail: 'r@m.com',
} as import('@/services/auth/auth.schema').UserDetail

const scenarioCertificate = {
  id: 'cert-id',
  certificateNumber: 'CN',
  scenarioName: 'SN',
  apiName: 'AN',
  apiId: 'api',
  applicationId: 'app',
  issueDate: 'd',
  status: 'ACTIVE' as const,
}

describe('useRegTicketForm', () => {
  beforeEach(() => {
    mockMutate.mockClear()
  })

  it('onSubmit parse và gọi mutation.mutate', async () => {
    const { result } = renderHook(() =>
      useRegTicketForm({
        authSession,
        scenarioCertificate,
      }),
    )
    await result.current.onSubmit({
      fullName: 'FN',
      email: 'e@m.co',
      phone: '0912345678',
      taxCode: 't',
      company: 'Co',
      role: 'Sec',
      companyAddress: '123 Nguyen Trai, Q1',
      representativeFullName: 'Nguyen Van A',
      representativePhone: '0987654321',
      representativeEmail: 'r@mail.co',
      apiId: 'api',
      testCertificate: 'cert-id',
      applicationId: 'app',
      apiName: 'AN',
      description: 'desc',
    } as any)
    expect(mockMutate).toHaveBeenCalled()
  })
})
