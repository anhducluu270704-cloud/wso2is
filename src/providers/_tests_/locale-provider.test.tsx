
import React from 'react'
import { render } from '@testing-library/react'
import LocaleWatcher from '../locale-provider'

const mockSetItem = jest.fn()
beforeAll(() => {
  Object.defineProperty(window, 'localStorage', {
    value: { getItem: jest.fn(), setItem: mockSetItem, removeItem: jest.fn(), clear: jest.fn() },
    writable: true,
  })
})

describe('LocaleWatcher (locale-provider)', () => {
  beforeEach(() => {
    mockSetItem.mockClear()
  })

  it('render không crash', () => {
    const { container } = render(<LocaleWatcher locale="vi" />)
    expect(container.firstChild).toBeNull()
  })

  it('set localStorage với acceptLang khi locale là vi', () => {
    render(<LocaleWatcher locale="vi" />)
    expect(mockSetItem).toHaveBeenCalledWith(
      expect.any(String),
      'vi_VN'
    )
  })

  it('set localStorage với acceptLang khi locale là en', () => {
    render(<LocaleWatcher locale="en" />)
    expect(mockSetItem).toHaveBeenCalledWith(
      expect.any(String),
      'en_US'
    )
  })

  it('set ACCEPT_LANGUAGE_DEFAULT khi locale không có trong LOCALES_LIST_PLUS', () => {
    render(<LocaleWatcher locale="xx" />)
    expect(mockSetItem).toHaveBeenCalledWith(
      expect.any(String),
      'vi_VN'
    )
  })

  it('không set localStorage khi locale là chuỗi rỗng', () => {
    render(<LocaleWatcher locale={'' as any} />)
    expect(mockSetItem).not.toHaveBeenCalled()
  })
})
