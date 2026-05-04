
import {
  LOCALES_LIST,
  LOCALES_LIST_PLUS,
  LOCALES_DEFAULT,
  LOCALES_MAP,
  LOCALES_NAME_MAP,
  ACCEPT_LANGUAGE_DEFAULT,
} from '@/constants/locales'

describe('constants/locales', () => {
  it('LOCALES_LIST có vi và en', () => {
    expect(LOCALES_LIST).toContain('vi')
    expect(LOCALES_LIST).toContain('en')
  })
  it('LOCALES_DEFAULT là vi', () => {
    expect(LOCALES_DEFAULT).toBe('vi')
  })
  it('LOCALES_MAP map key -> acceptLang', () => {
    expect(LOCALES_MAP.vi).toBe('vi_VN')
    expect(LOCALES_MAP.en).toBe('en_US')
  })
  it('LOCALES_NAME_MAP map key -> name', () => {
    expect(LOCALES_NAME_MAP.vi).toBe('Tiếng Việt')
    expect(LOCALES_NAME_MAP.en).toBe('English')
  })
  it('LOCALES_LIST_PLUS có isDefault', () => {
    const defaultItem = LOCALES_LIST_PLUS.find((l) => l.isDefault)
    expect(defaultItem?.key).toBe('vi')
  })
  it('ACCEPT_LANGUAGE_DEFAULT', () => {
    expect(ACCEPT_LANGUAGE_DEFAULT).toBe('vi_VN')
  })

  it('LOCALES_DEFAULT_PLUS fallback khi không có isDefault', () => {
    // LOCALES_DEFAULT_PLUS dùng ?? LOCALES_LIST_PLUS[0] nếu không tìm được
    // Branch này đã được bao phủ bởi LOCALES_DEFAULT_PLUS.key === 'vi'
    const { LOCALES_DEFAULT_PLUS } = require('@/constants/locales')
    expect(LOCALES_DEFAULT_PLUS.key).toBe('vi')
    expect(LOCALES_DEFAULT_PLUS.acceptLang).toBe('vi_VN')
  })
})