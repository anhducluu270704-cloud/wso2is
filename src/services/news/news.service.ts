import axiosClient from '@/libs/axiosClient'
import type {
  NewsByCategoryResponse,
  NewsCategoriesResponse,
  NewsDetailResponse,
  NewsHighlightResponse,
} from './news.schema'

export type NewsByCategoryParams = Readonly<{
  categoryId: string
  limit: number
  offset: number
}>

const newsApi = {
  getHighlights(): Promise<NewsHighlightResponse> {
    return axiosClient.get('/news/highlight')
  },

  getCategories(): Promise<NewsCategoriesResponse> {
    return axiosClient.get('/news/categories')
  },

  getNewsByCategory(
    params: NewsByCategoryParams,
  ): Promise<NewsByCategoryResponse> {
    const { categoryId, limit, offset } = params
    return axiosClient.get('/news', {
      params: { categoryId, limit, offset },
    })
  },

  getDetail(id: string): Promise<NewsDetailResponse> {
    return axiosClient.get(`/news/${id}`)
  },
}

export default newsApi
