
import {
  supportKeys,
  useGetGuideCategories,
  useGetGuideDocuments,
  useGetSupportList,
} from '../support.query-options'

jest.mock('@tanstack/react-query', () => ({
  useQuery: (opts: any) => ({ queryKey: opts.queryKey, queryFn: opts.queryFn }),
}))
jest.mock('../support.service', () => ({
  __esModule: true,
  default: {
    getFaqs: jest.fn(),
    getGuideCategories: jest.fn(),
    getGuideDocuments: jest.fn(),
  },
}))

const supportApi = require('../support.service').default
const mockGetFaqs = supportApi.getFaqs
const mockGetGuideCategories = supportApi.getGuideCategories
const mockGetGuideDocuments = supportApi.getGuideDocuments

describe('support.query-options', () => {
  beforeEach(() => {
    mockGetFaqs.mockResolvedValue({ data: [] })
    mockGetGuideCategories.mockResolvedValue({ data: [] })
    mockGetGuideDocuments.mockResolvedValue({ data: { list: [], count: 0 } })
  })

  it('supportKeys.all', () => {
    expect(supportKeys.all).toEqual(['support'])
  })

  it('supportKeys.list(filter)', () => {
    expect(supportKeys.list({ limit: 10, offset: 0 })).toEqual(['support', 'list', { limit: 10, offset: 0 }])
  })

  it('useGetSupportList trả về object có queryKey', () => {
    const result = useGetSupportList({ limit: 10, offset: 0 })
    expect(result.queryKey).toEqual(['support', 'list', { limit: 10, offset: 0 }])
  })

  it('useGetSupportList queryFn gọi supportApi.getFaqs với filter', async () => {
    const filter = { limit: 10, offset: 0 }
    const result = useGetSupportList(filter)
    await result.queryFn!()
    expect(mockGetFaqs).toHaveBeenCalledWith(filter)
  })

  it('supportKeys.guideCategories', () => {
    expect(supportKeys.guideCategories()).toEqual(['support', 'guide', 'categories'])
  })

  it('useGetGuideCategories queryFn gọi supportApi.getGuideCategories', async () => {
    const result = useGetGuideCategories()
    await result.queryFn!()
    expect(mockGetGuideCategories).toHaveBeenCalledWith()
  })

  it('supportKeys.guideDocuments(categoryId, filter)', () => {
    const filter = { limit: 10, offset: 0 }
    expect(supportKeys.guideDocuments('cid', filter)).toEqual([
      'support',
      'guide',
      'documents',
      'cid',
      filter,
    ])
  })

  it('useGetGuideDocuments queryFn gọi supportApi.getGuideDocuments', async () => {
    const filter = { limit: 10, offset: 0 }
    const result = useGetGuideDocuments('cat-1', filter)
    await result.queryFn!()
    expect(mockGetGuideDocuments).toHaveBeenCalledWith('cat-1', filter)
  })
})
