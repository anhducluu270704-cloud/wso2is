import { renderHook } from '@testing-library/react'
import { useApplicationForm } from '../hook'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import type { ThrottlingPoliciesDetail } from '@/services/application/application.schema'

const mockMutate = jest.fn()
jest.mock('@/services/application/application.mutations', () => ({
  useCreateApplicationMutation: () => ({
    mutate: mockMutate,
    isPending: false,
  }),
}))

const mockPolicy: ThrottlingPoliciesDetail = {
  name: '10PerMin',
  description: '',
  policyLevel: 'application',
  attributes: {},
  requestCount: 10,
  dataUnit: null,
  unitTime: 1,
  timeUnit: 'min',
  rateLimitCount: 10,
  rateLimitTimeUnit: null,
  quotaPolicyType: 'requestCount',
  tierPlan: null,
  stopOnQuotaReach: true,
  monetizationAttributes: {},
  throttlingPolicyPermissions: { type: 'allow', roles: ['user'] },
}

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('application/create/form hook', () => {
  beforeEach(() => {
    mockMutate.mockClear()
  })

  it('trả về form, handleSubmit, createMutation', () => {
    const { result } = renderHook(
      () =>
        useApplicationForm({
          onSuccess: () => {},
          throttlingPolicies: [mockPolicy],
        }),
      { wrapper }
    )
    expect(result.current.form).toBeDefined()
    expect(result.current.handleSubmit).toBeDefined()
    expect(result.current.createMutation).toBeDefined()
    expect(result.current.form.getValues('name')).toBe('')
    expect(result.current.form.getValues('throttlingPolicy')).toBe('Unlimited')
  })

  it('dùng throttlingPolicy mặc định khi không có policy đầu tiên', () => {
    const { result } = renderHook(
      () => useApplicationForm({ onSuccess: () => {}, throttlingPolicies: [] }),
      { wrapper }
    )

    expect(result.current.form.getValues('throttlingPolicy')).toBe('Unlimited')
  })

  it('handleSubmit gọi mutate và onSuccess callback', () => {
    const onSuccess = jest.fn()
    let mutateOptions: { onSuccess?: () => void } | undefined
    mockMutate.mockImplementation((_payload, options) => {
      mutateOptions = options
    })

    const { result } = renderHook(
      () => useApplicationForm({ onSuccess, throttlingPolicies: [mockPolicy] }),
      { wrapper }
    )

    result.current.handleSubmit({
      name: 'App',
      description: 'Desc',
      throttlingPolicy: 'Unlimited',
    })

    expect(mockMutate).toHaveBeenCalledWith(
      {
        name: 'App',
        description: 'Desc',
        throttlingPolicy: 'Unlimited',
      },
      expect.objectContaining({
        onSuccess: expect.any(Function),
      })
    )

    mutateOptions?.onSuccess?.()
    expect(onSuccess).toHaveBeenCalled()
  })
})
