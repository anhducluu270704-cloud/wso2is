import { BaseAPIResponse } from '@/models/api/common'
import { ScenarioDetailResponse } from '@/services/scenario/scenario.schema'
import scenarioApi from '@/services/scenario/scenario.service'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'


export const useGetScenarioDetailMutation = (api_id: string) => {

  return useMutation<ScenarioDetailResponse, AxiosError<BaseAPIResponse>>({
    mutationFn: () => scenarioApi.getDetailScenario(api_id),
  })
}
