import { BaseAPIResponse } from '@/models/api/common'
import scenarioApi from '@/services/scenario/scenario.service'
import { downloadJsonFile } from '@/util/download'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { ScenarioPostmanCollectionResponse } from './scenario.schema'
import { useTranslations } from 'next-intl'

export function useDownloadPostmanCollectionMutation(
  scenario_id: string,
  case_id: string,
  version_id: string,
  api_id: string,
  case_name: string
) {
  const t = useTranslations('api_product')
  return useMutation<
    ScenarioPostmanCollectionResponse,
    AxiosError<BaseAPIResponse>
  >({
    mutationFn: () => 
      scenarioApi.getScenarioPostmanCollection(
        scenario_id,
        case_id,
        version_id,
        api_id
      ),
    onSuccess: (data) => {
      downloadJsonFile(data.data, `${case_name}.postman_collection.json`)
    },
    onError: (error) => {
      toast.dismiss()
      toast.error(error.response?.data?.error ?? t('mess.download_postman_collection.error'))
    },
  })
}
