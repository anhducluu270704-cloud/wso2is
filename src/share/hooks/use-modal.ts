'use client'

import { useState, useCallback } from 'react'

export const useModal = (initialState: boolean = false) => {
  const [isOpen, setIsOpen] = useState(initialState)
  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])
  const toggleModal = useCallback(() => setIsOpen((prev) => !prev), [])

  return { isOpen, openModal, closeModal, toggleModal }
}

type UseModalDataProps<T> = Readonly<{
  initialState?: boolean
  initialData?: T
}>

export function useModalData<T>(props?: UseModalDataProps<T>) {
  const [isOpen, setIsOpen] = useState(props?.initialState ?? false)
  const [data, setData] = useState<T | undefined>(props?.initialData)
  const openModal = useCallback((newData: T) => {
    if (newData !== undefined) {
      setData(newData)
    }
    setIsOpen(true)
  }, [])
  const closeModal = useCallback(() => {
    setIsOpen(false)
    setData(undefined)
  }, [])

  return { isOpen, data, openModal, closeModal, setData }
}
