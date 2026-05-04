import axiosClient from '@/libs/axiosClient'
import { GetRegTicketDetailResponse } from './regTicket.schema'

const regTicketApi = {
  create(data: object): Promise<GetRegTicketDetailResponse> {
    const url = '/openapi-reg-integration'
    return axiosClient.post(url, data)
  },
}

export default regTicketApi
