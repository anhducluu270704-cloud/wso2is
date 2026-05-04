export const BUSINESS_SECTOR_OPTION_VALUES = [
  'FINANCE',
  'TECHNOLOGY',
  'COMMERCE',
  'EDUCATION',
  'SERVICE',
] as const

export type BusinessSectorOptionValue =
  (typeof BUSINESS_SECTOR_OPTION_VALUES)[number]
