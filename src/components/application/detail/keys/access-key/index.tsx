'use client'

import {
  useGetKeyManger,
  useGetOauthKeys,
} from '@/services/application/application.query-options'
import {
  ApplicationDetail,
  KeyManagerDetail,
  OauthKeyDetail,
} from '@/services/application/application.schema'
import { useCopy } from '@/share/hooks/use-copy'
import { Button } from '@/share/ui/button'
import { SpinnerCustom } from '@/share/ui/spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/share/ui/tabs'
import { useTranslations } from 'next-intl'
import { notFound } from 'next/navigation'
import { useOAuth2TokensSection } from './hook'
import ConsumerKeySection from './consumer-key'
import KeyConfigSection from './key-config'

export default function OAuth2TokensSection({
  applicationData,
}: Readonly<{ applicationData: ApplicationDetail }>) {
  const {
    data: keyManagers,
    isLoading: isLoadingKeyManagers,
    isError: isErrorKeyManagers,
    isSuccess: isSuccessKeyManagers,
  } = useGetKeyManger()
  const {
    data: oauthKeys,
    isLoading: isLoadingOauthKeys,
    isError: isErrorOauthKeys,
    isSuccess: isSuccessOauthKeys,
  } = useGetOauthKeys(applicationData.applicationId)

  if (isLoadingKeyManagers || isLoadingOauthKeys) {
    return (
      <div className="bg-white rounded-2xl flex flex-col gap-6">
        <SpinnerCustom className="py-12" />
      </div>
    )
  }

  if (isErrorKeyManagers || isErrorOauthKeys) {
    return notFound()
  }

  if (isSuccessKeyManagers && isSuccessOauthKeys) {
    const listTabsKeymanager = keyManagers.data.list
      .filter((data) => data.enabled === true)
      .map((data) => {
        const oauthKeysData =
          oauthKeys.data.list.find(
            (item) =>
              item.keyType === applicationData.tier &&
              item.keyManager === data.name
          ) ?? undefined
        return {
          id: data.id,
          label: data.name,
          value: data.type,
          isActive: true,
          content: (
            <OAuth2TokensView
              applicationData={applicationData}
              oauthKeysData={oauthKeysData}
              keyManagerData={data}
            />
          ),
        }
      })
    return (
      <Tabs
        defaultValue={
          listTabsKeymanager.find((item) => item.value === 'default')?.value ??
          listTabsKeymanager[0]?.value
        }
        className="gap-4"
      >
        {listTabsKeymanager.length > 1 && (
          <TabsList className="flex flex-row! justify-start gap-2 p-1.5 rounded-md! w-full">
            {listTabsKeymanager.map((tabs) => {
              return (
                <TabsTrigger
                  key={tabs.id}
                  value={tabs.value}
                  className="w-fit! rounded-md! py-1"
                >
                  {tabs.label}
                </TabsTrigger>
              )
            })}
          </TabsList>
        )}

        {listTabsKeymanager.map((tabs) => {
          return (
            <TabsContent key={tabs.id} value={tabs.value}>
              {tabs.content}
            </TabsContent>
          )
        })}
      </Tabs>
    )
  }
}

function OAuth2TokensView({
  keyManagerData,
  oauthKeysData,
  applicationData,
}: Readonly<{
  keyManagerData: KeyManagerDetail
  oauthKeysData?: OauthKeyDetail
  applicationData: ApplicationDetail
}>) {
  const t = useTranslations('application')

  const {
    grantTypes,
    setGrantTypes,
    properties,
    setProperties,
    callbackUrl,
    setCallbackUrl,
    isConfigurationUnchanged,
    onUpdateConfiguration,
    onGenerateKeys,
  } = useOAuth2TokensSection(applicationData, keyManagerData, oauthKeysData)

  const { copy, copyNonce } = useCopy()

  return (
    <div className="flex flex-col gap-12 bg-white px-12 py-8 rounded-2xl">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-title-lg-emphasize text-black-1">
          {t('detail.sections.oauth2_tokens')}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="lg"
          rounded
          disabled={!oauthKeysData || isConfigurationUnchanged}
          onClick={onUpdateConfiguration}
        >
          {t('btn.save_changes')}
        </Button>
      </div>

      <ConsumerKeySection
        applicationData={applicationData}
        oauthKeysData={oauthKeysData}
        keyManagerData={keyManagerData}
        copy={copy}
        copyNonce={copyNonce}
        onGenerateKeys={onGenerateKeys}
      />

      <KeyConfigSection
        grantTypes={grantTypes}
        onGrantTypesChange={setGrantTypes}
        properties={properties}
        onPropertiesChange={setProperties}
        keyManagerData={keyManagerData}
        callbackUrl={callbackUrl}
        onCallbackUrlChange={setCallbackUrl}
        copy={copy}
        copyNonce={copyNonce}
        tier={applicationData.tier}
      />
    </div>
  )
}
