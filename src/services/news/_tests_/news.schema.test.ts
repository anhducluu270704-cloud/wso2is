import {
  NewsArticleItemSchema,
  NewsByCategoryResponseSchema,
  NewsCategoriesResponseSchema,
  NewsDetailResponseSchema,
  NewsHighlightItemSchema,
  NewsHighlightResponseSchema,
  NewsItemSchema,
  NewsListResponseSchema,
} from '../news.schema'

describe('services/news/news.schema', () => {
  const validNewsItem = {
    id: 'news-1',
    titleEn: 'News title',
    titleVi: 'Tiêu đề',
    categoryEn: 'Updates',
    categoryVi: 'Cập nhật',
    imageUrl: 'https://example.com/image.png',
    descriptionEn: 'English description',
    descriptionVi: 'Mô tả',
    createDate: '2026-03-20T00:00:00.000Z',
  }

  it('parses NewsItemSchema with valid data', () => {
    const out = NewsItemSchema.parse(validNewsItem)
    expect(out).toEqual(validNewsItem)
  })

  it('rejects NewsItemSchema when required fields are missing/invalid', () => {
    const res = NewsItemSchema.safeParse({
      ...validNewsItem,
      id: 1,
    })

    expect(res.success).toBe(false)
  })

  it('parses NewsHighlightItemSchema và NewsHighlightResponseSchema', () => {
    const hl = {
      id: '69694115-da7a-4d8f-90d6-658d49bc7479',
      thumbnailUrl: 'data:image/jpeg;base64,abc',
      articleTitleVi: 'Tiêu đề VI',
      articleTitleEn: 'Title EN',
      categoryEn: 'News Category',
      categoryVi: 'Danh mục News',
      descriptionEn: '<p><strong>EN</strong></p>',
      descriptionVi: '<p><strong>VI</strong></p>',
      createdAt: '2026-05-02T19:48:16.836+00:00',
    }
    expect(NewsHighlightItemSchema.safeParse(hl).success).toBe(true)

    const out = NewsHighlightResponseSchema.parse({
      message: 'Success',
      code: '200',
      data: [hl],
    })
    expect(out.data).toHaveLength(1)
    expect(out.data[0]?.articleTitleEn).toBe('Title EN')
  })

  it('NewsHighlightResponseSchema từ chối khi data có hơn 4 bản tin', () => {
    const item = NewsHighlightItemSchema.parse({
      id: '1',
      thumbnailUrl: '',
      articleTitleVi: 'v',
      articleTitleEn: 'e',
      categoryEn: 'c',
      categoryVi: 'c',
      descriptionEn: 'd',
      descriptionVi: 'd',
      createdAt: '2026-01-01T00:00:00.000Z',
    })
    const res = NewsHighlightResponseSchema.safeParse({
      message: 'ok',
      code: '200',
      data: [item, item, item, item, item],
    })
    expect(res.success).toBe(false)
  })

  it('parses NewsCategoriesResponseSchema', () => {
    const out = NewsCategoriesResponseSchema.parse({
      code: '200',
      message: 'Success',
      data: [
        {
          categoryId: 'b7e7eea4-b3ab-42fa-bd6f-2e06b03e3cf4',
          categoryNameEn: 'News Category',
          categoryNameVi: 'Danh mục News',
        },
      ],
    })
    expect(out.data).toHaveLength(1)
    expect(out.data[0]?.categoryId).toBe(
      'b7e7eea4-b3ab-42fa-bd6f-2e06b03e3cf4',
    )
  })

  it('parses NewsByCategoryResponseSchema', () => {
    const article = {
      id: '69694115-da7a-4d8f-90d6-658d49bc7479',
      thumbnailUrl: 'data:image/jpeg;base64,abc',
      articleTitleVi: 'Tiêu đề VI',
      articleTitleEn: 'Title EN',
      categoryEn: 'News Category',
      categoryVi: 'Danh mục News',
      descriptionEn: '<p>EN</p>',
      descriptionVi: '<p>VI</p>',
      createdAt: '2026-05-02T19:48:16.836+00:00',
    }
    const out = NewsByCategoryResponseSchema.parse({
      code: '200',
      message: 'Success',
      data: {
        count: 6,
        list: [article],
        pagination: { limit: 6, total: 9, offset: 0 },
      },
    })
    expect(out.data.count).toBe(6)
    expect(out.data.list).toHaveLength(1)
    expect(out.data.pagination.total).toBe(9)
  })

  it('parses NewsListResponseSchema as APIResponse + array of items', () => {
    const out = NewsListResponseSchema.parse({
      message: 'ok',
      code: 'SUCCESS',
      data: [validNewsItem],
    })

    expect(out.data).toHaveLength(1)
    expect(out.data[0]).toEqual(validNewsItem)
  })

  it('rejects NewsListResponseSchema when data is not an array of items', () => {
    const res = NewsListResponseSchema.safeParse({
      message: 'ok',
      code: 'SUCCESS',
      // invalid: should be array, not object
      data: validNewsItem,
    })

    expect(res.success).toBe(false)
  })

  it('parses NewsDetailResponseSchema as APIResponse + article item', () => {
    const article = NewsArticleItemSchema.parse({
      id: '69694115-da7a-4d8f-90d6-658d49bc7479',
      thumbnailUrl: 'https://cdn.example/img.png',
      articleTitleVi: 'Tiêu đề VI',
      articleTitleEn: 'Title EN',
      categoryEn: 'News Category',
      categoryVi: 'Danh mục News',
      descriptionEn: '<p>EN</p>',
      descriptionVi: '<p>VI</p>',
      createdAt: '2026-05-02T19:48:16.836+00:00',
    })
    const out = NewsDetailResponseSchema.parse({
      message: 'ok',
      code: 'SUCCESS',
      data: article,
    })

    expect(out.data.articleTitleEn).toBe('Title EN')
  })
})
