import { API_PRODUCT_SEARCH_FIELDS } from '@/constants/api-product'
import axiosClient from '@/libs/axiosClient'
import { Filter } from '@/models/api/common'
import { convertQueryAPI } from '@/util/filter'
import {
  GetAllApiCategoryDetailResponse,
  GetAllApiProductResponse,
  GetApiProductDetailResponse,
} from './apiProduct.schema'

const apiProductApi = {
  getAll(query: Filter): Promise<GetAllApiProductResponse> {
    const url = '/api-product/list'
    return axiosClient.get(url, {
      params: convertQueryAPI(query, [...API_PRODUCT_SEARCH_FIELDS]),
    })
  },
  getDetail(id: string): Promise<GetApiProductDetailResponse> {
    const url = `/api-product/${encodeURIComponent(id)}`
    return axiosClient.get(url)
  },
  getThumbnail(id: string): Promise<Blob> {
    const url = `/api-product/${encodeURIComponent(id)}/thumbnail`
    return axiosClient.get(url, { responseType: 'blob' })
  },
  getCategories(): Promise<GetAllApiCategoryDetailResponse> {
    const url = '/api-product/categories'
    return axiosClient.get(url)
  },
}

export default apiProductApi
