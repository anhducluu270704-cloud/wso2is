import axiosClient from '@/libs/axiosClient'
import { BaseAPIResponse, Filter } from '@/models/api/common'
import { trimObject } from '@/util'
import {
  ApplicationRequest,
  GenerateAccessTokenDetail,
  GenerateKeysRequest,
  GenerateKeysResponse,
  GetAllApplicationsResponse,
  GetAllKeyMangerResponse,
  GetAllOauthKeyResponse,
  GetAllThrottlingPoliciesResponse,
  GetApplicationDetailResponse,
  GetApplicationSubscriptionsResponse,
  RevokeAccessTokenRequest,
  SubscribeApiRequest,
  SubscribeApiResponse,
  UpdateConfigurationRequest,
} from './application.schema'

const applicationApi = {
  getAll(filter?: Filter): Promise<GetAllApplicationsResponse> {
    const url = '/application/list'
    const params = filter ? { offset: filter.offset, limit: filter.limit } : {}
    return axiosClient.get(url, { params })
  },
  getAllWithApiStatus(
    filter?: Filter & { apiId: string }
  ): Promise<GetAllApplicationsResponse> {
    const url = '/application/list-with-api-status'
    const params = filter
      ? { offset: filter.offset, limit: filter.limit, apiId: filter.apiId }
      : {}
    return axiosClient.get(url, { params })
  },
  getDetail(id: string): Promise<GetApplicationDetailResponse> {
    const url = `/application/${encodeURIComponent(id)}`
    return axiosClient.get(url)
  },
  getKeyManger(): Promise<GetAllKeyMangerResponse> {
    const url = '/application/key-managers'
    return axiosClient.get(url)
  },
  getOauthKey(app_id: string): Promise<GetAllOauthKeyResponse> {
    const url = `/application/oauth-keys`
    return axiosClient.get(url, { params: { appId: app_id } })
  },
  getSubscriptions(
    applicationId: string
  ): Promise<GetApplicationSubscriptionsResponse> {
    const url = `/application/subscriptions`
    return axiosClient.get(url, { params: { appId: applicationId } })
  },
  deleteSubscription(subscriptionId: string): Promise<BaseAPIResponse> {
    const url = `/application/subscription/${encodeURIComponent(subscriptionId)}`
    return axiosClient.delete(url)
  },
  create(body: ApplicationRequest): Promise<GetApplicationDetailResponse> {
    const url = '/application'
    const data = trimObject(body, { removeEmptyString: true })
    return axiosClient.post(url, data)
  },
  getAllThrottlingPolicies(): Promise<GetAllThrottlingPoliciesResponse> {
    const url = `/application/throttling-policies/application`
    return axiosClient.get(url)
  },
  delete(id: string): Promise<BaseAPIResponse> {
    const url = `/application/${encodeURIComponent(id)}`
    return axiosClient.delete(url)
  },
  update(id: string, body: ApplicationRequest): Promise<BaseAPIResponse> {
    const url = `/application/${encodeURIComponent(id)}`
    const data = trimObject(body, { removeEmptyString: true })
    return axiosClient.put(url, data)
  },
  subscribe(
    applicationId: string,
    body: SubscribeApiRequest
  ): Promise<SubscribeApiResponse> {
    const url = `/application/${encodeURIComponent(applicationId)}/subscribe`
    return axiosClient.post(url, body)
  },
  deleteOAuthKey(
    applicationId: string,
    oauthKeyId: string
  ): Promise<BaseAPIResponse> {
    const url = `/application/${encodeURIComponent(applicationId)}/keys/${encodeURIComponent(oauthKeyId)}`
    return axiosClient.delete(url)
  },
  generateKeys(
    applicationId: string,
    body: GenerateKeysRequest
  ): Promise<GenerateKeysResponse> {
    const url = `/application/${encodeURIComponent(applicationId)}/generate-keys`
    return axiosClient.post(url, body)
  },
  updateConfiguration(
    applicationId: string,
    oauthKeyId: string,
    body: UpdateConfigurationRequest
  ): Promise<GenerateKeysResponse> {
    const url = `/application/oauth-keys`
    return axiosClient.put(url, body, {
      params: { appId: applicationId, keyMappingId: oauthKeyId },
    })
  },
  generateAccessToken(
    applicationId: string,
    oauthKeyId: string,
    body: RevokeAccessTokenRequest
  ): Promise<GenerateAccessTokenDetail> {
    const url = `/application/${encodeURIComponent(applicationId)}/keys/${encodeURIComponent(oauthKeyId)}/revoke-access-token`
    return axiosClient.post(url, body)
  },
}

export default applicationApi
