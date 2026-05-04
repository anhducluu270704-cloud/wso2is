import {
  KeyManagerDetail,
  OauthKeyDetail,
} from '@/services/application/application.schema'
import ContainerFormBody from '@/share/components/form'
import Modal from '@/share/components/modal'
import { useCopy } from '@/share/hooks/use-copy'
import { CopyIcon } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { useTranslations } from 'next-intl'
import { useMemo, useState } from 'react'

function CurlBase64Toggle({
  showReal,
  base64Encoded,
  onToggle,
}: Readonly<{
  showReal: boolean
  base64Encoded: string
  onToggle: () => void
}>) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-expanded={showReal}
      className="inline max-w-full cursor-pointer break-all border-0 bg-transparent p-0 align-baseline text-start font-inherit font-semibold text-blue-3 underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-3"
    >
      {showReal ? ` ${base64Encoded}` : ' Base64(consumer-key:consumer-secret)'}
    </button>
  )
}

export default function AccessTokenCURLModal({
  open,
  onOpenChange,
  keyManagerData,
  oauthKeysData,
}: Readonly<{
  open: boolean
  onOpenChange: (open: boolean) => void
  keyManagerData: KeyManagerDetail
  oauthKeysData: OauthKeyDetail
}>) {
  const t = useTranslations('application')
  const [showReal, setShowReal] = useState(false)
  const { copy } = useCopy()

  const basicAuthBase64 = useMemo(
    () =>
      btoa(`${oauthKeysData.consumerKey}:${oauthKeysData.consumerSecret}`),
    [oauthKeysData.consumerKey, oauthKeysData.consumerSecret]
  )

  const isAzureAD = keyManagerData.type === 'AzureAD'
  const azureScope = isAzureAD
    ? ` -d "scope=api://${oauthKeysData.consumerKey}/.default"`
    : ''

  const passwordGrantCurl = useMemo(
    () =>
      `curl -k -X POST ${keyManagerData.tokenEndpoint} -d ` +
      '"grant_type=password&username=Username&password=Password" -H ' +
      `"Authorization: Basic ${basicAuthBase64}"`,
    [keyManagerData.tokenEndpoint, basicAuthBase64]
  )

  const clientCredentialsCurl = useMemo(
    () =>
      `curl -k -X POST ${keyManagerData.tokenEndpoint} -d ` +
      '"grant_type=client_credentials"' +
      azureScope +
      ' -H ' +
      `"Authorization: Basic ${basicAuthBase64}"`,
    [keyManagerData.tokenEndpoint, basicAuthBase64, azureScope]
  )

  const toggleShowDecoded = () => {
    setShowReal((prev) => !prev)
  }

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title={t('keys.consumer_key.generate_curl.title')}
      onConfirm={() => {}}
      showFooter={false}
      isConfirmClose={false}
      contentClassName="min-w-0 max-w-[calc(100%-2rem)] overflow-x-hidden sm:max-w-[680px] [&_form]:min-w-0"
    >
      {keyManagerData.alias === null && (
        <ContainerFormBody>
          <div className="flex min-w-0 w-full max-w-full flex-col gap-6">
            <div className="flex min-w-0 max-w-full flex-col gap-2">
              <div className="text-body-body text-grey-6">
                {t('keys.consumer_key.generate_curl.label_1')}
              </div>
              <div className="relative max-w-full min-w-0 w-full rounded-xl border border-grey-9 bg-grey-11 p-4 pr-14 pt-2 text-start font-mono text-body-helptext text-grey-1">
                <div className="break-all">
                  <span className="text-blue-3">curl -k -X POST </span>
                  {keyManagerData.tokenEndpoint}
                  <span className="text-blue-3"> -d </span>
                  {'"grant_type=password&username=Username&password=Password"'}
                </div>
                <div className="break-all">
                  <span className="text-blue-3"> -H </span>
                  {'"Authorization: Basic'}
                  <CurlBase64Toggle
                    showReal={showReal}
                    base64Encoded={basicAuthBase64}
                    onToggle={toggleShowDecoded}
                  />
                  {'"'}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-3"
                  onClick={() => void copy(passwordGrantCurl)}
                >
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <div className="flex min-w-0 max-w-full flex-col gap-2">
              <div className="text-body-body text-grey-6">
                {t('keys.consumer_key.generate_curl.label_2')}
              </div>
              <div className="relative max-w-full min-w-0 w-full rounded-xl border border-grey-9 bg-grey-11 p-4 pr-14 pt-2 text-start font-mono text-body-helptext text-grey-1">
                <div className="break-all">
                  <span className="text-blue-3">curl -k -X POST </span>
                  {keyManagerData.tokenEndpoint}
                  <span className="text-blue-3"> -d </span>
                  {'"grant_type=client_credentials"'}
                  {isAzureAD && (
                    <>
                      <span className="text-blue-3"> -d </span>
                      {`"scope=api://${oauthKeysData.consumerKey}/.default"`}
                    </>
                  )}
                </div>
                <div className="break-all">
                  <span className="text-blue-3"> -H </span>
                  {'"Authorization: Basic'}
                  <CurlBase64Toggle
                    showReal={showReal}
                    base64Encoded={basicAuthBase64}
                    onToggle={toggleShowDecoded}
                  />
                  {'"'}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  className="absolute right-2 top-3"
                  onClick={() => void copy(clientCredentialsCurl)}
                >
                  <CopyIcon />
                </Button>
              </div>
            </div>
          </div>
        </ContainerFormBody>
      )}
    </Modal>
  )
}
