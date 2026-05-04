
import {
  HEADER_HEIGHT_DESKTOP,
  HEADER_HEIGHT_MOBILE,
  SIDEBAR_COOKIE_NAME,
  SIDEBAR_WIDTH,
  SIDEBAR_KEYBOARD_SHORTCUT,
} from '@/constants/layout'

describe('constants/layout', () => {
  it('HEADER_HEIGHT values là number', () => {
    expect(HEADER_HEIGHT_DESKTOP).toBe(64)
    expect(HEADER_HEIGHT_MOBILE).toBe(85)
  })
  it('SIDEBAR constants defined', () => {
    expect(SIDEBAR_COOKIE_NAME).toBe('sidebar_state')
    expect(SIDEBAR_WIDTH).toBe('16rem')
    expect(SIDEBAR_KEYBOARD_SHORTCUT).toBe('b')
  })
})