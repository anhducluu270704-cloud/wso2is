import { renderHook } from '@testing-library/react'

import { useGetScenarioDetailMutation } from '../hook'

const mockGetDetail = jest.fn()

jest.mock('@/services/scenario/scenario.service', () => ({
  __esModule: true,
  default: {
    getDetailScenario: (...a: unknown[]) => mockGetDetail(...a),
  },
}))

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
}))

let capturedMutation: { mutationFn?: () => Promise<unknown> } | null = null

jest.mock('@tanstack/react-query', () => ({
  useMutation: (opts: { mutationFn: () => Promise<unknown> }) => {
    capturedMutation = opts
    return { mutate: jest.fn(), mutateAsync: jest.fn() }
  },
}))

describe('api-product/tryout/hook', () => {
  beforeEach(() => {
    mockGetDetail.mockReset()
    capturedMutation = null
  })

  it('mutationFn gọi scenarioApi.getDetailScenario với api_id', async () => {
    mockGetDetail.mockResolvedValue({ id: 'sc1' })
    renderHook(() => useGetScenarioDetailMutation('api-9'))
    expect(capturedMutation).not.toBeNull()
    await capturedMutation!.mutationFn!()
    expect(mockGetDetail).toHaveBeenCalledWith('api-9')
  })
})
