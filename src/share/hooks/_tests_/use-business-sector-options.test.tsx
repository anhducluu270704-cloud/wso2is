import { renderHook } from '@testing-library/react'

import { useBusinessSectorOptions } from '../use-business-sector-options'

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => `t:${key}`,
}))

describe('useBusinessSectorOptions', () => {
  it('sectorSelectOptions map tất cả sector với label dịch', () => {
    const { result } = renderHook(() => useBusinessSectorOptions())
    expect(result.current.sectorSelectOptions).toHaveLength(5)
    expect(result.current.sectorSelectOptions[0]).toEqual({
      value: 'FINANCE',
      label: 't:fields.business_sector.finance',
    })
  })

  it('getSectorDisplayLabel trả label dịch khi value hợp lệ', () => {
    const { result } = renderHook(() => useBusinessSectorOptions())
    expect(result.current.getSectorDisplayLabel('TECHNOLOGY')).toBe(
      't:fields.business_sector.technology'
    )
  })

  it('getSectorDisplayLabel trả nguyên chuỗi khi không thuộc enum', () => {
    const { result } = renderHook(() => useBusinessSectorOptions())
    expect(result.current.getSectorDisplayLabel('LEGACY_OR_API_VALUE')).toBe(
      'LEGACY_OR_API_VALUE'
    )
  })
})
