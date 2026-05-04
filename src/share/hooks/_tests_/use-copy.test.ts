import { renderHook, act, waitFor } from '@testing-library/react'

import { useCopy } from '../use-copy'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

const mockWriteText = jest.fn()

jest.mock('sonner', () => ({
  toast: { error: jest.fn() },
}))

describe('useCopy', () => {
  beforeEach(() => {
    mockWriteText.mockReset()
    Object.assign(navigator, {
      clipboard: { writeText: mockWriteText },
    })
    const { toast } = require('sonner') as { toast: { error: jest.Mock } }
    toast.error.mockClear()
  })

  it('copy thành công: writeText, tăng copyNonce, trả true', async () => {
    mockWriteText.mockResolvedValue(undefined)
    const { result } = renderHook(() => useCopy())

    let ok = false
    await act(async () => {
      ok = await result.current.copy('hello')
    })

    expect(ok).toBe(true)
    expect(mockWriteText).toHaveBeenCalledWith('hello')
    expect(result.current.copyNonce).toBe(1)
  })

  it('copy thất bại: toast.error và trả false', async () => {
    mockWriteText.mockRejectedValue(new Error('denied'))
    const { result } = renderHook(() => useCopy())
    const { toast } = require('sonner') as { toast: { error: jest.Mock } }

    let ok = true
    await act(async () => {
      ok = await result.current.copy('x')
    })

    expect(ok).toBe(false)
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('copy.error')
    })
  })
})
