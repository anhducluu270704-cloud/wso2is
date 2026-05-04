import {
  useGetApplication,
  useGetOauthKeys,
} from '@/services/application/application.query-options'
import { useDownloadPostmanCollectionMutation } from '@/services/scenario/scenario.mutations'
import { useGetScenarioSwaggerSpec } from '@/services/scenario/scenario.query-options'
import { PostmanIcon, SwaggerIcon } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { SpinnerCustom } from '@/share/ui/spinner'
import { useCallback } from 'react'
import { useTryoutDetailContext } from '../provider'
import AccessToken from './access-token'
import { downloadJsonFile } from '@/util/download'
import { useTranslations } from 'next-intl'

export default function SecuritySection({
  app_id,
  scenario_id,
  version_id,
  api_id,
  case_id,
  case_name,
}: Readonly<{
  app_id: string
  scenario_id: string
  version_id: string
  api_id: string
  case_id: string
  case_name: string
}>) {
  const { accessToken, setAccessToken } = useTryoutDetailContext()
  const t = useTranslations('api_product')

  const {
    data: swaggerSpec,
    isLoading: isLoadingSwaggerSpec,
    isError: isErrorSwaggerSpec,
    isSuccess: isSuccessSwaggerSpec,
  } = useGetScenarioSwaggerSpec(scenario_id, case_id, version_id, api_id)
  const {
    data: oauthKeys,
    isLoading: isLoadingOauthKeys,
    isError: isErrorOauthKeys,
    isSuccess: isSuccessOauthKeys,
  } = useGetOauthKeys(app_id)
  const {
    data: applicationDetail,
    isLoading: isLoadingApplicationDetail,
    isError: isErrorApplicationDetail,
    isSuccess: isSuccessApplicationDetail,
  } = useGetApplication(app_id)

  const downloadPostmanCollectionMutation =
    useDownloadPostmanCollectionMutation(
      scenario_id,
      case_id,
      version_id,
      api_id,
      case_name
    )

  const oauthKeysData = oauthKeys?.data.list.find(
    (item) =>
      item.keyType === 'SANDBOX' && item.keyManager === 'Resident Key Manager'
  )

  const onDownloadSwagger = useCallback(() => {
    if (!swaggerSpec?.data) return
    downloadJsonFile(swaggerSpec.data, `${case_name}.swagger.json`)
  }, [swaggerSpec?.data, case_name])

  if (
    isLoadingSwaggerSpec ||
    isLoadingOauthKeys ||
    isLoadingApplicationDetail
  ) {
    return (
      <div className="bg-white rounded-2xl flex flex-col gap-6">
        <SpinnerCustom className="py-12" />
      </div>
    )
  }

  if (isErrorSwaggerSpec || isErrorOauthKeys || isErrorApplicationDetail) {
    return null
  }

  if (
    isSuccessSwaggerSpec &&
    isSuccessOauthKeys &&
    isSuccessApplicationDetail
  ) {
    return (
      <div className="flex flex-col gap-4 text-body-body text-black-1">
        <div className="text-title-md">{t('tryout.security.title')}</div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <div className="text-body-emphasize">{t('tryout.security.security_type')}</div>
            <div className="">OAuth</div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-body-emphasize">{t('tryout.security.application')}</div>
            <div className="">{applicationDetail.data.name}</div>
          </div>
        </div>
        <AccessToken
          accessToken={accessToken}
          setAccessToken={setAccessToken}
          app_id={app_id}
          key_mapping_id={oauthKeysData?.keyMappingId ?? ''}
          consumer_secret={oauthKeysData?.consumerSecret ?? ''}
          additional_properties={oauthKeysData?.additionalProperties ?? {}}
        />
        <div className="flex flex-col gap-2">
          <div className="text-body-emphasize">
            Gateway <span className="font-normal">(Environment)</span>
          </div>
          <div className="">Sandbox</div>
        </div>
        <div className="flex gap-4">
          <Button
            variant="select"
            size="xs"
            rounded
            className="text-grey-6 font-normal px-2"
            onClick={() => downloadPostmanCollectionMutation.mutate()}
          >
            <PostmanIcon className="size-6" />
            Postman Collection
          </Button>
          <Button
            variant="select"
            size="xs"
            rounded
            className="text-grey-6 font-normal px-2"
            onClick={onDownloadSwagger}
          >
            <SwaggerIcon className="size-6" />
            Swagger (/swagger.json)
          </Button>
        </div>
      </div>
    )
  }
}
