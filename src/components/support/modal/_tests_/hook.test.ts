
import { renderHook } from '@testing-library/react'
import { useSupportRequestForm, defaultValues } from '../hook'

const mockMutate = jest.fn()

jest.mock('@/services/support/support.mutations', () => ({
  useSupportRequestMutation: () => ({ mutate: mockMutate }),
}))
jest.mock('react-hook-form', () => ({
  useForm: (opts: any) => ({
    register: () => ({}),
    handleSubmit: (fn: any) => () => fn({}),
    formState: { errors: {} },
    reset: jest.fn(),
  }),
}))
jest.mock('@hookform/resolvers/zod', () => ({ zodResolver: () => () => ({}) }))

describe('support/modal/hook', () => {
  it('defaultValues có đủ fields', () => {
    expect(defaultValues).toMatchObject({
      full_name: '',
      email: '',
      company_name: '',
      phone_number: '',
      request_type: '',
      description: '',
    })
  })

  it('useSupportRequestForm trả về form, onSubmit, mutation', () => {
    const { result } = renderHook(() =>
      useSupportRequestForm({ onSuccess: jest.fn() })
    )
    expect(result.current.form).toBeDefined()
    expect(typeof result.current.onSubmit).toBe('function')
    expect(result.current.mutation).toBeDefined()
  })

  it('onSubmit gọi mutate với dữ liệu hợp lệ và onSuccess reset form + callback', () => {
    const onSuccess = jest.fn()
    const { result } = renderHook(() => useSupportRequestForm({ onSuccess }))
    const { form, onSubmit } = result.current

    mockMutate.mockImplementationOnce((_data, opts) => {
      opts?.onSuccess?.()
    })

    onSubmit({
      full_name: 'John Doe',
      email: 'john@example.com',
      company_name: 'ACME',
      phone_number: '0123',
      request_type: 'technical',
      description: 'Help',
    } as any)

    expect(mockMutate).toHaveBeenCalled()
    expect((form.reset as jest.Mock)).toHaveBeenCalled()
    expect(onSuccess).toHaveBeenCalled()
  })
})