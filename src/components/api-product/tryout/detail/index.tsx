import { ScenarioDetail } from '@/services/scenario/scenario.schema'
import GuideSection from './guide'
import SwaggerSection from './swagger'
import SecuritySection from './security'
import { TryoutDetailProvider } from './provider'

export default function TryoutDetail({
  scenarioDetail,
  api_id,
  case_id,
  app_id,
  case_name,
}: Readonly<{
  scenarioDetail: ScenarioDetail
  api_id: string
  case_id: string
  app_id: string
  case_name: string
}>) {
  return (
    <TryoutDetailProvider>
      <div className="flex flex-col gap-4 transition-all duration-300 ease-in-out">
        <GuideSection />
        <SecuritySection
          scenario_id={scenarioDetail.id}
          version_id={scenarioDetail.active_version_id}
          api_id={api_id}
          case_id={case_id}
          app_id={app_id}
          case_name={case_name}
        />
        <SwaggerSection
          scenario_id={scenarioDetail.id}
          version_id={scenarioDetail.active_version_id}
          api_id={api_id}
          case_id={case_id}
        />
      </div>
    </TryoutDetailProvider>
  )
}
