import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAGE_START,
  TypeFilterQuery,
} from '@/constants/system'
import {
  Filter,
  FilterQuery,
  FilterSchema,
  FilterSearchParam,
  FilterSort,
} from '@/models/api/common'

export function parseFilterSearchParams(
  params: FilterSearchParam
): ReturnType<typeof FilterSchema.safeParse> {
  const page = (params.page ?? DEFAULT_PAGE_START) - DEFAULT_PAGE_START
  const limit = params.limit ?? DEFAULT_PAGE_SIZE
 
  return FilterSchema.safeParse({
    limit: params.limit,
    offset: page * limit,
    keyword: params.keyword,
    category: params.category,
    sort: deserializeSort(params.sort),
    query: decodeQueryParams(params.query),
  })
}

export const convertQueryAPI = (
  filter: Filter,
  nameSearch?: string | string[]
) => {
  const filters = serializeFiltersParam(filter.category)
  const queryList: FilterQuery[] = [...(filter.query ?? [])]
  
  const query = serializeQueryParam(filter.keyword, queryList, {
    searchName: nameSearch,
  })
  return {
    offset: filter.offset,
    limit: filter.limit,
    ...(filters && { filters }),
    ...(query && { query }),
    sort: serializeSort(filter.sort),
  }
}

function serializeFiltersParam(category?: string): string | undefined {
  if (!category?.trim() || category === 'all') return undefined
  return `api-category:${category.trim()}`
}

function addKeywordParts(
  parts: string[],
  keyword: string,
  searchName: string | string[]
): void {
  const trimmed = keyword.trim()
  if (Array.isArray(searchName)) {
    for (const field of searchName) parts.push(`${field}:${trimmed}`)
  } else {
    parts.push(`${searchName}:${trimmed}`)
  }
}

function addQueryListParts(parts: string[], queryList: FilterQuery[]): void {
  for (const q of queryList) {
    const value = Array.isArray(q.value) ? q.value.join(',') : String(q.value)
    if (value) parts.push(`${q.name}:${value}`)
  }
}

function serializeQueryParam(
  keyword?: string,
  queryList?: FilterQuery[],
  option?: { searchName?: string | string[] }
): string | undefined {
  const parts: string[] = []
  if (keyword?.trim()) {
    addKeywordParts(parts, keyword, option?.searchName ?? 'name')
  }
  if (queryList?.length) {
    addQueryListParts(parts, queryList)
  }
  return parts.length > 0 ? parts.join(';') : undefined
}

export const decodeQueryParams = (
  query?: string
): FilterQuery[] | undefined => {
  if (!query) return undefined
  const listQuery = query.split(';')
  if (listQuery.length < 1) return undefined
  return listQuery.map(decodeQueryParamItem).filter((e) => e != undefined)
}

type ParsedValueResult = {
  type: TypeFilterQuery
  parsedValue: string | string[] | boolean
}

function parseStrPrefixValue(value: string): ParsedValueResult | undefined {
  const isStrPrefix = value.startsWith('str!')
  const isStrLike = value.startsWith('str*')
  if (!isStrPrefix && !isStrLike) return undefined
  const parsedValue = value.slice(4)
  if (!parsedValue) return undefined
  return { type: isStrPrefix ? 'ne' : 'like', parsedValue }
}

function parseBoolPrefixValue(value: string): ParsedValueResult | undefined {
  const isBoolPrefix = value.startsWith('bool!')
  const isBoolLike = value.startsWith('bool*')
  if (!isBoolPrefix && !isBoolLike) return undefined
  const boolVal = value.slice(5)
  if (boolVal === 'true')
    return { type: isBoolPrefix ? 'ne' : 'like', parsedValue: true }
  if (boolVal === 'false')
    return { type: isBoolPrefix ? 'ne' : 'like', parsedValue: false }
  return undefined
}

function parseNegationOrLikeValue(
  value: string
): ParsedValueResult | undefined {
  const isNegation = value.startsWith('!')
  const isLike = value.startsWith('*')
  if (!isNegation && !isLike) return undefined
  const values = value.slice(1).split(',').filter(Boolean)
  if (values.length === 0) return undefined
  const parsedValue = values.length === 1 ? values[0] : values
  return { type: isNegation ? 'ne' : 'like', parsedValue }
}

function parseDefaultQueryValue(value: string): ParsedValueResult | undefined {
  const values = value.split(',').filter(Boolean)
  if (values.length === 0) return undefined
  const parsedValue = values.length === 1 ? values[0] : values
  return { type: 'eq', parsedValue }
}

const decodeQueryParamItem = (queryString: string): FilterQuery | undefined => {
  if (!queryString) return undefined

  const [rawName, rawValue] = queryString.split('=')
  if (!rawName || rawValue === undefined) return undefined

  const name = decodeURIComponent(rawName.trim())
  const value = rawValue.trim()

  const parsed =
    parseStrPrefixValue(value) ??
    parseBoolPrefixValue(value) ??
    parseNegationOrLikeValue(value) ??
    parseDefaultQueryValue(value)

  if (!parsed) return undefined
  return { name, type: parsed.type, value: parsed.parsedValue, sub: undefined }
}

export function serializeSort(sort?: FilterSort): string | undefined {
  if (!sort) return undefined
  return `${sort.name}:${sort.dir}`
}

export function deserializeSort(input?: string): FilterSort | undefined {
  if (!input) return undefined
  const [name, dir] = input.split(':')
  if (!name || (dir !== 'asc' && dir !== 'desc')) return undefined
  return { name, dir: dir }
}
