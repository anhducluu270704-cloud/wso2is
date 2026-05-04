import type { FaqArticle } from '@/services/support/support.schema'

export const MOCK_FAQ_ARTICLE: FaqArticle = {
  id: '1',
  articleTitleEn: 'How to reset password?',
  articleTitleVi: 'Làm sao đặt lại mật khẩu?',
  descriptionEn: 'Go to profile and click change password.',
  descriptionVi: 'Vào hồ sơ và chọn đổi mật khẩu.',
  createdAt: '2024-01-15T08:00:00.000Z',
}

export const MOCK_SUPPORT_ITEM = MOCK_FAQ_ARTICLE

export const MOCK_FAQ_ARTICLES = [MOCK_FAQ_ARTICLE]

export const MOCK_SUPPORT_LIST = MOCK_FAQ_ARTICLES
