'use client'

import { LOCALES_LIST } from '@/constants/locales'
import { useRouter } from '@/i18n/navigation'
import {
  useGetDetailScenario,
  useGetScenarioResource,
  useGetScenarioStatus,
} from '@/services/scenario/scenario.query-options'
import {
  ScenarioDetailResponse,
  ScenarioResourceGroup,
  ScenarioResultDetail,
} from '@/services/scenario/scenario.schema'
import Alert from '@/share/components/alert'
import FullPageLayout from '@/share/components/full-page/full-layout'
import LoadingPage from '@/share/components/full-page/loading'
import { Button } from '@/share/ui/button'
import { ChevronLeft } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { notFound, usePathname } from 'next/navigation'
import TryoutListTab from './list-tab'

function withoutLocalePrefix(pathname: string) {
  let p = pathname
  while (p && p !== '/') {
    let stripped = false
    for (const loc of LOCALES_LIST) {
      const prefix = `/${loc}`
      if (p === prefix) {
        p = '/'
        stripped = true
        break
      }
      if (p.startsWith(`${prefix}/`)) {
        p = p.slice(prefix.length) || '/'
        stripped = true
        break
      }
    }
    if (!stripped) break
  }
  return p
}

export default function ApiProductTryouWrapper({
  api_id,
  app_id,
  case_id,
}: Readonly<{
  api_id: string
  app_id: string
  case_id: string
}>) {
  const {
    data: scenario,
    isLoading,
    isError,
    isSuccess,
  } = useGetDetailScenario(api_id)

  const scenarioId = scenario?.data?.id ?? ''
  const scenarioVersionId = scenario?.data?.active_version_id ?? ''
  const {
    data: scenarioResourceData,
    isLoading: isScenarioResourceLoading,
    isError: isScenarioResourceError,
    isSuccess: isScenarioResourceSuccess,
  } = useGetScenarioResource(
    scenarioId,
    scenarioVersionId,
    api_id,
    isSuccess && Boolean(scenarioId && scenarioVersionId)
  )

  const {
    data: scenarioStatusData,
    isLoading: isScenarioStatusLoading,
    isError: isScenarioStatusError,
    isSuccess: isScenarioStatusSuccess,
  } = useGetScenarioStatus(
    app_id,
    scenarioId,
    scenarioVersionId,
    api_id,
    isSuccess && Boolean(scenarioId && scenarioVersionId)
  )

  if (isScenarioResourceLoading || isScenarioStatusLoading || isLoading)
    return <LoadingPage />
  if (isScenarioResourceError || isScenarioStatusError || isError)
    return notFound()
  if (isScenarioResourceSuccess && isScenarioStatusSuccess && isSuccess) {
    return (
      <FullPageLayout>
        <ApiProductTryoutView
          scenarioDetail={scenario}
          api_id={api_id}
          app_id={app_id}
          resourceGroups={scenarioResourceData.data.resource_groups}
          case_id={case_id}
          scenarioStatusData={scenarioStatusData.data}
        />
      </FullPageLayout>
    )
  }
}

function ApiProductTryoutView({
  scenarioDetail,
  api_id,
  app_id,
  resourceGroups,
  case_id,
  scenarioStatusData,
}: Readonly<{
  scenarioDetail: ScenarioDetailResponse
  api_id: string
  app_id: string
  resourceGroups: ScenarioResourceGroup[]
  case_id: string
  scenarioStatusData: ScenarioResultDetail[]
}>) {
  const t = useTranslations('api_product')
  const router = useRouter()
  const pathname = usePathname()

  return (
    <div className="container mx-auto flex flex-col gap-6">
      <Button
        variant="secondary"
        size="sm"
        className="font-normal!"
        rounded
        linked
        onClick={() => {
          const fallbackPath = `/api-products`
          const backPath = pathname.replace(/\/tryout/, '')
          const href =
            backPath === '' || backPath === '/'
              ? fallbackPath
              : withoutLocalePrefix(backPath)
          router.push(href || fallbackPath)
        }}
      >
        <ChevronLeft className="size-5 text-black!" />
        {t('btn.back', {
          name: scenarioDetail.data.api_name,
        })}
      </Button>
      <div className="text-headline-lg-mobile text-black">
        {t('tryout.header')}
      </div>
      <Alert
        type="info"
        title={t('tryout.info.title')}
        description={
          <div className="flex items-center gap-0.5 text-body-helptext">
            {t('tryout.info.description')}
            <Button
              variant="secondary"
              size="sm"
              rounded
              linked
              onClick={() => router.push('/support')}
            >
              {t('tryout.info.link')}
            </Button>
          </div>
        }
      />

      <TryoutListTab
        scenarioDetail={scenarioDetail}
        api_id={api_id}
        resourceGroups={resourceGroups}
        app_id={app_id}
        case_id={case_id}
        scenarioStatusData={scenarioStatusData}
      />
    </div>
  )
}
