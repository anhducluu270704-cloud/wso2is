'use client'

import { ApplicationDetail } from '@/services/application/application.schema'
import ApplicationOverviewCards from './card'
import ViewToken from './view-token'

export default function OverviewSection(
  props: Readonly<{ applicationData: ApplicationDetail }>
) {
  return (
    <div className="flex flex-col gap-12 px-12 py-8 bg-white rounded-2xl">
      <ApplicationOverviewCards applicationData={props.applicationData} />
      <ViewToken
        scopes={[
          {
            scope: 'Scope',
            value: props.applicationData.subscriptionScopes
              .map((scope) => scope.key)
              .join(', ')
              .toUpperCase(),
          },
        ]}
      />
    </div>
  )
}
