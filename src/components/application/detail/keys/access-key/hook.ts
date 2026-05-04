'use client'

import { DEFAULT_GRANT_TYPES } from '@/constants/application'
import {
  useGenerateKeysMutation,
  useUpdateConfigurationMutation,
} from '@/services/application/application.mutations'
import type {
  ApplicationDetail,
  GenerateKeysRequest,
  KeyManagerDetail,
  OauthKeyDetail,
  PropertyKey,
  UpdateConfigurationRequest,
} from '@/services/application/application.schema'
import { useEffect, useMemo, useState } from 'react'

function compareStringsLocale(a: string, b: string): number {
  return a.localeCompare(b)
}

export const useOAuth2TokensSection = (
  applicationData: ApplicationDetail,
  keyManagerData: KeyManagerDetail,
  oauthKeysData?: OauthKeyDetail
) => {
  const [grantTypes, setGrantTypes] = useState<string[]>(
    oauthKeysData?.supportedGrantTypes?.length
      ? oauthKeysData.supportedGrantTypes
      : DEFAULT_GRANT_TYPES
  )

  const [callbackUrl, setCallbackUrl] = useState<string>(
    oauthKeysData?.callbackUrl ?? ''
  )

  const [properties, setProperties] = useState<PropertyKey>(() =>
    oauthKeysData?.additionalProperties
      ? { ...oauthKeysData.additionalProperties }
      : {}
  )

  // Reset local form state when server payload changes (e.g. after refetch).
  /* eslint-disable react-hooks/set-state-in-effect -- intentional sync from query to editable state */
  useEffect(() => {
    setGrantTypes(
      oauthKeysData?.supportedGrantTypes?.length
        ? oauthKeysData.supportedGrantTypes
        : DEFAULT_GRANT_TYPES
    )
    setCallbackUrl(oauthKeysData?.callbackUrl ?? '')
    setProperties(
      oauthKeysData?.additionalProperties
        ? { ...oauthKeysData.additionalProperties }
        : {}
    )
  }, [oauthKeysData])
  /* eslint-enable react-hooks/set-state-in-effect */

  const generateMutation = useGenerateKeysMutation(
    applicationData.applicationId
  )

  const updateConfigurationMutation = useUpdateConfigurationMutation(
    applicationData.applicationId,
    oauthKeysData?.keyMappingId ?? ''
  )

  const updateConfigurationData = useMemo<UpdateConfigurationRequest>(
    () => ({
      keyType: oauthKeysData?.keyType ?? 'SANDBOX',
      keyManager: keyManagerData.name,
      supportedGrantTypes: grantTypes,
      callbackUrl: callbackUrl,
      additionalProperties: properties,
    }),
    [
      grantTypes,
      properties,
      callbackUrl,
      oauthKeysData?.keyType,
      keyManagerData.name,
    ]
  )

  const generateKeysData = useMemo<GenerateKeysRequest>(
    () => ({
      keyType: applicationData.tier,
      keyManager: keyManagerData.name,
      grantTypesToBeSupported: grantTypes,
      callbackUrl: callbackUrl,
      additionalProperties: properties,
    }),
    [grantTypes, properties, callbackUrl, keyManagerData.name]
  )

  const onUpdateConfiguration = () => {
    updateConfigurationMutation.mutate(updateConfigurationData)
  }

  const onGenerateKeys = () => {
    generateMutation.mutate(generateKeysData)
  }

  const isPropertiesUnchanged = useMemo(() => {
    const initialProperties: PropertyKey = oauthKeysData?.additionalProperties
      ? { ...oauthKeysData.additionalProperties }
      : {}
    const initialKeys =
      Object.keys(initialProperties).sort(compareStringsLocale)
    const currentKeys = Object.keys(properties).sort(compareStringsLocale)

    if (initialKeys.length !== currentKeys.length) return false
    for (let i = 0; i < initialKeys.length; i += 1) {
      const key = initialKeys[i]
      if (key !== currentKeys[i]) return false
      if (initialProperties[key] !== properties[key]) return false
    }
    return true
  }, [oauthKeysData?.additionalProperties, properties])

  const isGrantTypesUnchanged = useMemo(() => {
    const initialGrantTypes = oauthKeysData?.supportedGrantTypes?.length
      ? oauthKeysData.supportedGrantTypes
      : DEFAULT_GRANT_TYPES
    if (initialGrantTypes.length !== grantTypes.length) return false
    const initialSorted = [...initialGrantTypes].sort(compareStringsLocale)
    const currentSorted = [...grantTypes].sort(compareStringsLocale)
    return initialSorted.every(
      (grantType, index) => grantType === currentSorted[index]
    )
  }, [oauthKeysData, grantTypes])

  const isCallbackUrlUnchanged = useMemo(() => {
    const initialCallbackUrl = (oauthKeysData?.callbackUrl ?? '').trim()
    return initialCallbackUrl === callbackUrl.trim()
  }, [oauthKeysData?.callbackUrl, callbackUrl])

  const isConfigurationUnchanged =
    isPropertiesUnchanged && isGrantTypesUnchanged && isCallbackUrlUnchanged

  return {
    grantTypes,
    setGrantTypes,
    properties,
    setProperties,
    callbackUrl,
    setCallbackUrl,
    isConfigurationUnchanged,
    onUpdateConfiguration,
    onGenerateKeys,
  }
}
