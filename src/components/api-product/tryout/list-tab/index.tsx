'use client'

import { usePathname, useRouter } from '@/i18n/navigation'
import { useGetScenarioCertificate } from '@/services/scenario/scenario.query-options'
import {
  ScenarioDetailResponse,
  ScenarioResourceGroup,
  ScenarioResultDetail,
} from '@/services/scenario/scenario.schema'
import { TabsSkeleton } from '@/share/components/skeleton/tabs'
import { CaseSuccess, Lock } from '@/share/icons'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/share/ui/accordion'
import { Button } from '@/share/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/share/ui/tabs'
import { useTranslations } from 'next-intl'
import { notFound, useSearchParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import TryoutCertificate from '../certificate'
import TryoutDetail from '../detail'

type TryoutListTabProps = {
  resourceGroups: ScenarioResourceGroup[]
  onSelectCase?: (caseId: string) => void
  scenarioDetail: ScenarioDetailResponse
  api_id: string
  app_id: string
  case_id: string
  scenarioStatusData: ScenarioResultDetail[]
}

export default function TryoutListTab({
  resourceGroups,
  onSelectCase,
  scenarioDetail,
  api_id,
  app_id,
  case_id,
  scenarioStatusData,
}: Readonly<TryoutListTabProps>) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('api_product')

  const {
    data: certificate,
    isLoading,
    isError,
    isSuccess,
  } = useGetScenarioCertificate(
    app_id,
    scenarioDetail.data.id,
    scenarioDetail.data.active_version_id,
    api_id
  )
  const flatCases = useMemo(
    () => resourceGroups.flatMap((group) => group.cases),
    [resourceGroups]
  )
  const selectableCaseIds = useMemo(
    () => new Set(flatCases.map((item) => item.case_id)),
    [flatCases]
  )
  const defaultCaseId = case_id ?? flatCases[0]?.case_id
  const caseIdToGroupKey = useMemo(() => {
    return resourceGroups.reduce<Record<string, string>>((acc, group) => {
      const groupKey = `${group.resource_key}-${group.path}-${group.http_method}`
      group.cases.forEach((scenarioCase) => {
        acc[scenarioCase.case_id] = groupKey
      })
      return acc
    }, {})
  }, [resourceGroups])
  const resolveCaseId = (value?: string) => {
    if (!value) return undefined
    if (value === 'certificate') return value
    if (selectableCaseIds.has(value)) return value
    return undefined
  }

  const caseIdFromQuery = resolveCaseId(
    searchParams.get('case_id') ?? undefined
  )
  const currentCaseId = case_id ?? caseIdFromQuery ?? defaultCaseId
  const activeGroupKey = currentCaseId
    ? caseIdToGroupKey[currentCaseId]
    : undefined
  const [openGroupKeys, setOpenGroupKeys] = useState<string[]>(
    activeGroupKey ? [activeGroupKey] : []
  )

  useEffect(() => {
    if (!activeGroupKey) return
    setOpenGroupKeys((prev) =>
      prev.includes(activeGroupKey) ? prev : [...prev, activeGroupKey]
    )
  }, [activeGroupKey])

  useEffect(() => {
    if (!currentCaseId) return
    const currentQueryCaseId = searchParams.get('case_id') ?? undefined
    if (currentQueryCaseId === currentCaseId) return

    const params = new URLSearchParams(searchParams.toString())
    params.set('case_id', currentCaseId)
    const nextQuery = params.toString()
    router.replace(nextQuery ? `${pathname}?${nextQuery}` : pathname)
  }, [currentCaseId, pathname, router, searchParams])

  if (isLoading) return <TabsSkeleton />

  if (isError) return notFound()

  if (isSuccess) {
    return (
      <Tabs
        value={currentCaseId}
        onValueChange={(caseId) => {
          const nextCaseId = resolveCaseId(caseId)
          if (!nextCaseId) return
          onSelectCase?.(nextCaseId)
          const nextGroupKey = caseIdToGroupKey[nextCaseId]
          if (nextGroupKey) {
            setOpenGroupKeys((prev) =>
              prev.includes(nextGroupKey) ? prev : [...prev, nextGroupKey]
            )
          }
          const params = new URLSearchParams(searchParams.toString())
          params.set('case_id', nextCaseId)
          const nextQuery = params.toString()
          router.push(nextQuery ? `${pathname}?${nextQuery}` : pathname)
        }}
        orientation="vertical"
        className="gap-6"
      >
        <TabsList className="w-full rounded-none items-stretch max-w-[338px]">
          <div className="relative flex flex-col max-h-[800px] overflow-x-hidden overflow-y-auto">
            <Accordion
              type="multiple"
              value={openGroupKeys}
              onValueChange={(value) => setOpenGroupKeys(value)}
            >
              {resourceGroups.map((group) => {
                const groupKey = `${group.resource_key}-${group.path}-${group.http_method}`
                return (
                  <AccordionItem
                    className="border-none!"
                    key={groupKey}
                    value={groupKey}
                  >
                    <AccordionTrigger className="min-w-0 w-full gap-2 px-4 py-3 rounded-md items-center text-body-body! text-black-1 [&_svg]:text-black-1! [&_svg]:size-4 [&_svg]:shrink-0">
                      <span className="min-w-0 flex-1 truncate text-start">
                        {group.path}
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="bg-transparent! h-fit p-0">
                      {group.cases.map((scenarioCase) => (
                        <TabsTrigger
                          key={scenarioCase.case_id}
                          value={scenarioCase.case_id}
                          className="pl-8 justify-between!"
                        >
                          <span className="truncate text-black-1! text-body-body">
                            {scenarioCase.case_name}
                          </span>
                          {scenarioStatusData.find(
                            (item) => item.caseId === scenarioCase.case_id
                          ) && <CaseSuccess className="size-5 mr-[30px]" />}
                        </TabsTrigger>
                      ))}
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
            <TabsTrigger
              key={'certificate'}
              value={'certificate'}
              className="justify-between! sticky bottom-0 left-0 right-0 h-fit bg-white"
            >
              <span className="truncate font-semibold">
                {t('tryout.tabs.certificate')}
              </span>
              <div className="flex items-center gap-2.5">
                {certificate.data && certificate.data !== null && (
                  <CaseSuccess className="size-5" />
                )}
                <Lock className="size-5 text-grey-2" />
              </div>
            </TabsTrigger>
          </div>
        </TabsList>
        <div className="flex flex-1 flex-col gap-8">
          {flatCases.map((scenarioCase) => (
            <TabsContent
              key={scenarioCase.case_id}
              value={scenarioCase.case_id}
              className="px-12 py-8 bg-white rounded-2xl font-semibold"
            >
              <TryoutDetail
                scenarioDetail={scenarioDetail.data}
                api_id={api_id}
                case_id={scenarioCase.case_id}
                case_name={scenarioCase.case_name}
                app_id={app_id}
              />
            </TabsContent>
          ))}
          <TabsContent key={'certificate'} value={'certificate'}>
            <TryoutCertificate certificate={certificate.data ?? null} />
          </TabsContent>
          <div className="flex justify-between items-center">
            <div className="text-black-1">
              {!certificate.data || certificate.data === null
                ? t('hint.empty_certificate.description')
                : t('hint.certificate.description')}
            </div>
            <Button
              rounded
              size="lg"
              disabled={!certificate.data || certificate.data === null}
              onClick={() =>
                router.push(
                  `/reg-ticket/create?scenario_id=${scenarioDetail.data.id}&version_id=${scenarioDetail.data.active_version_id}&application_id=${app_id}&api_id=${api_id}`
                )
              }
            >
              {t('btn.request')}
            </Button>
          </div>
        </div>
      </Tabs>
    )
  }
}
