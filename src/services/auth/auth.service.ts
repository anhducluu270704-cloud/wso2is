import axiosClient from '@/libs/axiosClient'
import { BaseAPIResponse } from '@/models/api/common'
import { trimObject } from '@/util'
import {
  AuthInfoBaseResponse,
  GetTokenRequest,
  GetUrlLoginResponse,
  LogoutRequest,
  RefreshTokenRequest,
  SignUpRequest,
  ParseTokenResponse,
  SignUpResponse,
  VerifyTokenResponse,
} from './auth.schema'

const authApi = {
  signIn(callback: string): Promise<GetUrlLoginResponse> {
    const url = '/auth/login'
    return axiosClient.get(url, { params: { callback } })
  },
  getToken(body: GetTokenRequest): Promise<AuthInfoBaseResponse> {
    const url = '/auth/token'
    return axiosClient.post(url, body)
  },
  signUp(body: SignUpRequest): Promise<SignUpResponse> {
    const url = '/auth/register'
    const data = trimObject(body, { removeEmptyString: true })
    return axiosClient.post(url, data)
  },
  verifyToken(token: string): Promise<VerifyTokenResponse> {
    const url = '/auth/verify'
    return axiosClient.get(url, { params: { token } })
  },
  parseToken(token: string): Promise<ParseTokenResponse> {
    const url = '/auth/parse-token'
    return axiosClient.get(url, { params: { token } })
  },
  refresh(body: RefreshTokenRequest): Promise<AuthInfoBaseResponse> {
    const url = '/auth/refresh'
    const data = trimObject(body, { removeEmptyString: true })
    return axiosClient.post(url, data)
  },
  logout(body: LogoutRequest): Promise<BaseAPIResponse> {
    const url = '/auth/logout'
    return axiosClient.get(url, {
      params: { callback: body.callback, idToken: body.idToken },
    })
  },
}

export default authApi
