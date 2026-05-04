
import { renderHook, act } from '@testing-library/react'
import { useModal, useModalData } from '../use-modal'

describe('share/hooks/use-modal', () => {
  describe('useModal', () => {
    it('initialState false mặc định', () => {
      const { result } = renderHook(() => useModal())
      expect(result.current.isOpen).toBe(false)
    })
    it('initialState true', () => {
      const { result } = renderHook(() => useModal(true))
      expect(result.current.isOpen).toBe(true)
    })
    it('openModal set true', () => {
      const { result } = renderHook(() => useModal(false))
      act(() => result.current.openModal())
      expect(result.current.isOpen).toBe(true)
    })
    it('closeModal set false', () => {
      const { result } = renderHook(() => useModal(true))
      act(() => result.current.closeModal())
      expect(result.current.isOpen).toBe(false)
    })
    it('toggleModal đảo trạng thái', () => {
      const { result } = renderHook(() => useModal(false))
      act(() => result.current.toggleModal())
      expect(result.current.isOpen).toBe(true)
      act(() => result.current.toggleModal())
      expect(result.current.isOpen).toBe(false)
    })
  })

  describe('useModalData', () => {
    it('openModal với data, closeModal xóa data', () => {
      const { result } = renderHook(() => useModalData<{ id: string }>())
      expect(result.current.isOpen).toBe(false)
      expect(result.current.data).toBeUndefined()
      act(() => result.current.openModal({ id: '1' }))
      expect(result.current.isOpen).toBe(true)
      expect(result.current.data).toEqual({ id: '1' })
      act(() => result.current.closeModal())
      expect(result.current.isOpen).toBe(false)
      expect(result.current.data).toBeUndefined()
    })
    it('openModal(undefined) chỉ mở modal không set data', () => {
      const { result } = renderHook(() => useModalData<{ id: string }>())
      act(() => result.current.openModal(undefined as any))
      expect(result.current.isOpen).toBe(true)
      expect(result.current.data).toBeUndefined()
    })
    it('initialState và initialData', () => {
      const { result } = renderHook(() =>
        useModalData<{ x: number }>({ initialState: true, initialData: { x: 1 } })
      )
      expect(result.current.isOpen).toBe(true)
      expect(result.current.data).toEqual({ x: 1 })
    })
  })
})