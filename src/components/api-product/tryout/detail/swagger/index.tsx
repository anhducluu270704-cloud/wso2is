'use client'

import type React from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { notFound } from 'next/navigation'
import SwaggerUI from 'swagger-ui-react'
import 'swagger-ui-react/swagger-ui.css'

import {
  scenarioKeys,
  useGetScenarioSwaggerSpec,
} from '@/services/scenario/scenario.query-options'
import { SpinnerCustom } from '@/share/ui/spinner'
import { useTryoutDetailContext } from '../provider'

const API_KEY_HEADER_NAME = 'apikey'

function Empty() {
  return null
}

function disableAuthorizeAndInfoPlugin() {
  return {
    wrapComponents: {
      info: () => Empty,
      authorizeBtn: () => Empty,
      authorizeOperationBtn: () => Empty,
    },
  }
}

type SwaggerRequest = {
  url?: string
  headers?: Record<string, string> | Headers
}

function assignHeader(req: SwaggerRequest, name: string, value: string) {
  const v = value.trim()
  if (!v) return

  if (typeof Headers !== 'undefined' && req.headers instanceof Headers) {
    req.headers.set(name, v)
    return
  }

  const prev =
    req.headers &&
    typeof req.headers === 'object' &&
    !(req.headers instanceof Headers)
      ? { ...req.headers }
      : {}

  req.headers = { ...prev, [name]: v }
}

export default function SwaggerSection({
  scenario_id,
  version_id,
  api_id,
  case_id,
}: Readonly<{
  scenario_id: string
  version_id: string
  api_id: string
  case_id: string
}>) {
  const { securitySchemeType, accessToken } = useTryoutDetailContext()

  const queryClient = useQueryClient()

  const securitySchemeRef = useRef(securitySchemeType)
  const accessTokenRef = useRef(accessToken)

  useEffect(() => {
    securitySchemeRef.current = securitySchemeType
  }, [securitySchemeType])

  useEffect(() => {
    accessTokenRef.current = accessToken
  }, [accessToken])

  const {
    data: swaggerSpec,
    isLoading,
    isError,
    isSuccess,
  } = useGetScenarioSwaggerSpec(scenario_id, case_id, version_id, api_id)

  const requestInterceptor = useCallback((req: SwaggerRequest) => {
    const scheme = securitySchemeRef.current

    if (scheme === 'OAUTH') {
      const token = accessTokenRef.current
      if (token) assignHeader(req, 'Authorization', `Bearer ${token}`)
    } else if (scheme === 'API_KEY') {
      const key = accessTokenRef.current
      if (key) assignHeader(req, API_KEY_HEADER_NAME, key)
    }

    return req
  }, [])

  const responseInterceptor = useCallback(
    (
      response: Parameters<
        NonNullable<
          React.ComponentProps<typeof SwaggerUI>['responseInterceptor']
        >
      >[0]
    ) => {
      window.setTimeout(() => {
        void queryClient.invalidateQueries({ queryKey: scenarioKeys.all })
      }, 500)
      return response
    },
    [queryClient]
  )

  const plugins = useMemo(() => [disableAuthorizeAndInfoPlugin()], [])

  if (isLoading) return <SpinnerCustom />
  if (isError) return notFound()
  if (!isSuccess) return null

  return (
    <div className="flex flex-col gap-2">
      <SwaggerUI
        spec={swaggerSpec.data}
        // docExpansion="list"
        defaultModelsExpandDepth={-1}
        defaultModelExpandDepth={-1}
        // displayRequestDuration
        plugins={plugins}
        requestInterceptor={requestInterceptor}
        responseInterceptor={responseInterceptor}
      />
    </div>
  )
}
