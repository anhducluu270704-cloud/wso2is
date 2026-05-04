import { renderHook } from '@testing-library/react'

import { useCreateRegTicketMutation } from '../regTicket.mutations'

const mockInvalidateQueries = jest.fn()
const mockCreate = jest.fn()
const mockPush = jest.fn()

jest.mock('sonner', () => ({
  toast: {
    dismiss: jest.fn(),
    loading: jest.fn(),
    success: jest.fn(),
    error: jest.fn(),
  },
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

let capturedMutationOpts: Record<string, unknown> | null = null

jest.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: mockInvalidateQueries,
  }),
  useMutation: (opts: Record<string, unknown>) => {
    capturedMutationOpts = opts
    return { mutate: jest.fn(), mutateAsync: jest.fn() }
  },
}))

jest.mock('../regTicket.service', () => ({
  __esModule: true,
  default: {
    create: (...a: unknown[]) => mockCreate(...a),
  },
}))

describe('regTicket.mutations', () => {
  const getToast = () => require('sonner').toast as Record<string, jest.Mock>

  beforeEach(() => {
    mockInvalidateQueries.mockClear()
    mockCreate.mockClear()
    mockPush.mockClear()
    capturedMutationOpts = null
    const toast = getToast()
    Object.values(toast).forEach((fn) => fn.mockClear())
  })

  describe('useCreateRegTicketMutation', () => {
    it('onSuccess: invalidate, router với ticket_id', () => {
      renderHook(() => useCreateRegTicketMutation())
      const opts = capturedMutationOpts!
      opts.onMutate?.()
      expect(getToast().dismiss).toHaveBeenCalled()
      expect(getToast().loading).toHaveBeenCalled()

      opts.onSuccess?.({ data: { id: 't99' } } as any)
      expect(getToast().dismiss).toHaveBeenCalled()
      expect(mockInvalidateQueries).toHaveBeenCalled()
      expect(mockPush).toHaveBeenCalledWith('/reg-ticket/create?ticket_id=t99')
    })

    it('onError: toast error', () => {
      renderHook(() => useCreateRegTicketMutation())
      const opts = capturedMutationOpts!
      opts.onError?.({
        response: { data: { error: 'fail' } },
      } as any)
      expect(getToast().error).toHaveBeenCalledWith('fail')
    })

    it('mutationFn gọi create', async () => {
      mockCreate.mockResolvedValue({})
      renderHook(() => useCreateRegTicketMutation())
      const opts = capturedMutationOpts!
      await opts.mutationFn?.({} as any)
      expect(mockCreate).toHaveBeenCalledWith({})
    })
  })
})
