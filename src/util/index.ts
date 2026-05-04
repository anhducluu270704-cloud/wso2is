import { InfiniteData } from '@tanstack/react-query'

type TrimOptions = {
  removeEmptyString?: boolean
  removeEmptyObject?: boolean
}

export type NavItemBase<T = unknown> = {
  title?: string
  url?: string
  items?: NavItemBase<T>[]
}

export function formatStatusLabel(value: string | null | undefined) {
  const normalized = value == null ? '' : String(value)
  return normalized
    .toLowerCase()
    .split('_')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

export function formatStringToArray(value: string | null | undefined) {
  const normalized = value == null ? '' : String(value).trim()
  if (normalized === '') return []
  return normalized.split(/\s+/).filter(Boolean)
}

function findTitle<T extends NavItemBase>(
  items: T[] | undefined,
  pathname: string
): string | null {
  if (!items) return null
  for (const item of items) {
    if (item.url === pathname && item.title) return item.title
    if (item.items) {
      const found = findTitle(item.items, pathname)
      if (found) return found
    }
  }
  return null
}

export function getTitleByPath<T extends NavItemBase>(
  navItems: T[],
  pathname: string
): string {
  for (const group of navItems) {
    const found = findTitle(group.items, pathname)
    if (found) return found
  }
  return ''
}

function trim(data: string): string {
  return (data ?? '').trim().replace(/\s{2,}/g, ' ')
}

function trimArrayValue(
  array: unknown[],
  options?: TrimOptions
): unknown[] | undefined {
  const mapped = array.map((item) => {
    if (typeof item === 'object' && item !== null) {
      return trimObject(item as Record<string, unknown>, options)
    }
    return item
  })

  const filtered = mapped.filter((item) => {
    if (typeof item === 'object' && item !== null) {
      const keysCount = Object.keys(item).length
      if (keysCount === 0) {
        return !options?.removeEmptyObject
      }
    }

    if (options?.removeEmptyString && item === '') return false
    return true
  })

  if (filtered.length > 0) return filtered
  if (options?.removeEmptyObject) return undefined
  return []
}

function isEmptyRecord(value: unknown): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    Object.keys(value).length === 0
  )
}

function trimObjectValue(
  value: unknown,
  options?: TrimOptions
): { shouldInclude: boolean; value: unknown } {
  if (typeof value === 'string') {
    const trimmed = trim(value)
    if (options?.removeEmptyString && trimmed === '') {
      return { shouldInclude: false, value: trimmed }
    }
    return { shouldInclude: true, value: trimmed }
  }

  if (Array.isArray(value)) {
    const newArray = trimArrayValue(value, options)
    if (newArray === undefined) {
      return { shouldInclude: false, value }
    }
    return { shouldInclude: true, value: newArray }
  }

  if (typeof value === 'object' && value !== null) {
    const trimmedObj = trimObject(value as Record<string, unknown>, options)
    if (options?.removeEmptyObject && isEmptyRecord(trimmedObj)) {
      return { shouldInclude: false, value: trimmedObj }
    }
    return { shouldInclude: true, value: trimmedObj }
  }

  return { shouldInclude: true, value }
}

export function trimObject<T extends Record<string, unknown>>(
  obj: T,
  options?: TrimOptions
): T {
  const result: Record<string, unknown> = {}

  for (const k of Object.keys(obj)) {
    const trimmedValue = trimObjectValue(obj[k], options)
    if (!trimmedValue.shouldInclude) continue
    result[k] = trimmedValue.value
  }

  return result as T
}

export function convertDataToParams<T extends Record<string, unknown>>(
  data: T
) {
  const params = new URLSearchParams()

  const toParamValue = (v: unknown) => {
    if (
      typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'boolean'
    ) {
      return String(v)
    }
    return JSON.stringify(v)
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      if (Array.isArray(value)) {
        value.forEach((item) => params.append(key, toParamValue(item)))
      } else {
        params.append(key, toParamValue(value))
      }
    }
  })

  return params
}

export function decodeJwtPayloadWithoutVerification(token: string): unknown {
  try {
    const base64Url = token.split('.')[1]
    if (base64Url == null || base64Url.length === 0) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )

    return JSON.parse(jsonPayload) as unknown
  } catch {
    return null
  }
}

type InfiniteGridPage = {
  data?: {
    list?: unknown[]
  }
}

export function totalGridsCount(data: InfiniteData<InfiniteGridPage>) {
  return data.pages.reduce(
    (total, page) => total + (page.data?.list?.length ?? 0),
    0
  )
}

export function visibleGridsCount(
  data: InfiniteData<InfiniteGridPage> | undefined,
  limit: number | undefined,
  defaultLimit: number
) {
  const normalizedLimit = Math.max(1, Math.floor(limit || defaultLimit))
  const loadedResultCount = data ? totalGridsCount(data) : 0
  return Math.min(loadedResultCount, normalizedLimit)
}
