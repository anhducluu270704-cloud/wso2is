import axiosClient from '@/libs/axiosClient'
import { BaseAPIResponse, Filter } from '@/models/api/common'
import { convertQueryAPI } from '@/util/filter'
import {
  GetFaqsResponse,
  GetGuideCategoriesResponse,
  GetGuideDocumentsResponse,
  SupportRequest,
} from './support.schema'

const supportApi = {
  getFaqs(filter: Filter): Promise<GetFaqsResponse> {
    const url = '/faqs'
    return axiosClient.get(url, { params: convertQueryAPI(filter) })
  },

  getGuideCategories(): Promise<GetGuideCategoriesResponse> {
    const url = '/document-guides/categories'
    return axiosClient.get(url)
  },

  getGuideDocuments(
    categoryId: string,
    filter: Filter,
  ): Promise<GetGuideDocumentsResponse> {
    const url = '/document-guides'
    return axiosClient.get(url, {
      params: { categoryId, ...convertQueryAPI(filter) },
    })
  },

  create(body: SupportRequest): Promise<BaseAPIResponse> {
    const url = '/support/request'
    return axiosClient.post(url, body)
  },
}

export default supportApi
