
/**
 * Unit test: services/support - schema validation
 */
import {
  FaqArticleSchema,
  FaqCategorySchema,
  SupportRequestSchema,
  SupportCategorySchema,
  GetFaqsResponseSchema,
  GuideCategorySchema,
  GuideDocumentSchema,
  GetGuideCategoriesResponseSchema,
  GetGuideDocumentsResponseSchema,
} from '../support.schema'

describe('services/support/support.schema', () => {
  describe('SupportCategorySchema', () => {
    it('chấp nhận account-registration và authentication', () => {
      expect(SupportCategorySchema.safeParse('account-registration').success).toBe(true)
      expect(SupportCategorySchema.safeParse('authentication').success).toBe(true)
      expect(SupportCategorySchema.safeParse('other').success).toBe(false)
    })
  })

  describe('FaqArticleSchema', () => {
    it('parse article từ API faqs', () => {
      const result = FaqArticleSchema.safeParse({
        id: 'f321f8f8-aab2-4906-82fe-62146491c66f',
        articleTitleVi: 'FAQ title vi',
        articleTitleEn: 'FAQ title en',
        descriptionEn: 'desc en',
        descriptionVi: 'desc vi',
        createdAt: '2026-05-02T05:12:29.087+00:00',
      })
      expect(result.success).toBe(true)
    })

    it('từ chối khi thiếu field bắt buộc', () => {
      expect(
        FaqArticleSchema.safeParse({
          id: '2',
          articleTitleEn: 'Q2?',
        }).success,
      ).toBe(false)
    })
  })

  describe('SupportRequestSchema', () => {
    it('cần full_name, email, company_name, phone_number, request_type', () => {
      const valid = SupportRequestSchema.safeParse({
        full_name: 'User',
        email: 'user@company.com',
        company_name: 'Co',
        phone_number: '0901234567',
        request_type: 'question',
        description: 'Optional',
      })
      expect(valid.success).toBe(true)
    })
    it('email phải hợp lệ', () => {
      const invalid = SupportRequestSchema.safeParse({
        full_name: 'U',
        email: 'invalid',
        company_name: 'Co',
        phone_number: '0901234567',
        request_type: 'q',
      })
      expect(invalid.success).toBe(false)
    })

    it('description tối đa 512 ký tự và optional', () => {
      expect(
        SupportRequestSchema.safeParse({
          full_name: 'User',
          email: 'user@company.com',
          company_name: 'Co',
          phone_number: '0901234567',
          request_type: 'question',
        }).success,
      ).toBe(true)

      expect(
        SupportRequestSchema.safeParse({
          full_name: 'User',
          email: 'user@company.com',
          company_name: 'Co',
          phone_number: '0901234567',
          request_type: 'question',
          description: 'x'.repeat(513),
        }).success,
      ).toBe(false)
    })
  })

  describe('FAQ response schemas', () => {
    it('parse GetFaqsResponse — count + list, không có pagination', () => {
      expect(
        GetFaqsResponseSchema.safeParse({
          message: 'Success',
          code: '200',
          data: {
            count: 1,
            list: [
              {
                categoryId: '76dc0b31-9389-40bc-acc7-4c7c41f3da8b',
                categoryNameVi: 'Danh mục FAQ',
                categoryNameEn: 'FAQ Category',
                faqArticle: [
                  {
                    id: 'f321f8f8-aab2-4906-82fe-62146491c66f',
                    articleTitleVi: 'FAQ title vi',
                    articleTitleEn: 'FAQ title en',
                    descriptionEn: 'desc en',
                    descriptionVi: 'desc vi',
                    createdAt: '2026-05-02T05:12:29.087+00:00',
                  },
                ],
              },
              {
                categoryId: 'd4138b32-4040-443b-89bc-7c246741268d',
                categoryNameVi: 'Danh mục FAQ',
                categoryNameEn: 'FAQ Category 2',
                faqArticle: [],
              },
            ],
          },
        }).success,
      ).toBe(true)
    })
  })

  describe('FaqCategorySchema', () => {
    it('chấp nhận list rỗng faqArticle', () => {
      expect(
        FaqCategorySchema.safeParse({
          categoryId: 'c1',
          categoryNameVi: 'V',
          categoryNameEn: 'E',
          faqArticle: [],
        }).success,
      ).toBe(true)
    })
  })
})

describe('Guide API schemas', () => {
  it('GuideCategorySchema parse cây có children lồng nhau', () => {
    expect(
      GuideCategorySchema.safeParse({
        categoryId: '037de7c0-60e7-4aa6-bc0e-93ddc4b7b6f0',
        categoryNameEn: 'Category test',
        categoryNameVi: 'Danh muc test',
        children: [
          {
            categoryId: 'c61be3d8-0093-466b-a25b-fa579cd3faa5',
            categoryNameEn: 'Category test',
            categoryNameVi: 'Danh muc test',
            children: [],
          },
        ],
      }).success,
    ).toBe(true)
  })

  it('GetGuideCategoriesResponseSchema parse data là mảng', () => {
    expect(
      GetGuideCategoriesResponseSchema.safeParse({
        code: '200',
        message: 'Success',
        data: [
          {
            categoryId: '5508d8e6-210e-445e-853a-007ebfc23866',
            categoryNameEn: 'Category test',
            categoryNameVi: 'category khạc',
            children: [],
          },
        ],
      }).success,
    ).toBe(true)
  })

  it('GuideDocumentSchema và GetGuideDocumentsResponseSchema', () => {
    expect(
      GuideDocumentSchema.safeParse({
        id: '91ee235e-953d-42b9-8f59-60dceca9c73b',
        documentTitleEn: 'Guide EN',
        documentTitleVi: 'Guide VI',
        categoryEn: 'Category update',
        categoryVi: 'category khạc',
        descriptionEn: 'desc en',
        descriptionVi: 'desc vi',
        createdAt: '2026-05-02T04:54:18.188+00:00',
      }).success,
    ).toBe(true)

    expect(
      GetGuideDocumentsResponseSchema.safeParse({
        code: '200',
        message: 'Success',
        data: {
          count: 1,
          list: [
            {
              id: '91ee235e-953d-42b9-8f59-60dceca9c73b',
              documentTitleEn: 'Guide EN',
              documentTitleVi: 'Guide VI',
              categoryEn: 'Category update',
              categoryVi: 'category khạc',
              descriptionEn: 'desc en',
              descriptionVi: 'desc vi',
              createdAt: '2026-05-02T04:54:18.188+00:00',
            },
          ],
        },
      }).success,
    ).toBe(true)
  })
})
