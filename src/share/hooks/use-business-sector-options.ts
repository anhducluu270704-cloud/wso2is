'use client'

import {
  BUSINESS_SECTOR_OPTION_VALUES,
  type BusinessSectorOptionValue,
} from '@/constants/business-sector'
import { useTranslations } from 'next-intl'
import { useCallback, useMemo } from 'react'

const SIGNUP_LABEL_KEYS: Record<BusinessSectorOptionValue, string> = {
  FINANCE: 'fields.business_sector.finance',
  TECHNOLOGY: 'fields.business_sector.technology',
  COMMERCE: 'fields.business_sector.commerce',
  EDUCATION: 'fields.business_sector.education',
  SERVICE: 'fields.business_sector.service',
}

export function useBusinessSectorOptions() {
  const t = useTranslations('signup')

  const sectorSelectOptions = useMemo(
    () =>
      BUSINESS_SECTOR_OPTION_VALUES.map((value) => ({
        value,
        label: t(SIGNUP_LABEL_KEYS[value]),
      })),
    [t]
  )

  const getSectorDisplayLabel = useCallback(
    (storedValue: string) => {
      if (
        BUSINESS_SECTOR_OPTION_VALUES.includes(
          storedValue as BusinessSectorOptionValue
        )
      ) {
        return t(SIGNUP_LABEL_KEYS[storedValue as BusinessSectorOptionValue])
      }
      return storedValue
    },
    [t]
  )

  return { sectorSelectOptions, getSectorDisplayLabel }
}
