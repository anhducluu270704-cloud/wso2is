'use client'

import {
  useDeleteOAuthKeyMutation,
  useGenerateAccessTokenMutation,
} from '@/services/application/application.mutations'
import {
  ApplicationDetail,
  KeyManagerDetail,
  OauthKeyDetail,
} from '@/services/application/application.schema'
import ReadOnlyInputField from '@/share/components/input/read_only'
import ConfirmModal from '@/share/components/modal/confirm'
import type { UseCopyActions } from '@/share/hooks/use-copy'
import { useModal } from '@/share/hooks/use-modal'
import { DeleteDocument } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import AccessTokenCURLModal from './modal'

export default function ConsumerKeySection({
  applicationData,
  oauthKeysData,
  keyManagerData,
  copy,
  copyNonce,
  onGenerateKeys,
}: Readonly<
  {
    applicationData: ApplicationDetail
    oauthKeysData?: OauthKeyDetail
    keyManagerData: KeyManagerDetail
    onGenerateKeys: () => void
  } & UseCopyActions
>) {
  const t = useTranslations('application')
  const mutate = useDeleteOAuthKeyMutation(
    applicationData.applicationId,
    oauthKeysData?.keyMappingId ?? ''
  )
  const [openConfirm, setOpenConfirm] = useState(false)
  const [accessToken, setAccessToken] = useState<string | undefined>(undefined)
  const generateAccessTokenMutation = useGenerateAccessTokenMutation(
    applicationData.applicationId,
    oauthKeysData?.keyMappingId ?? ''
  )
  const { isOpen, openModal, closeModal } = useModal()

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="text-title-sm text-black-1 font-semibold">
          {t('keys.oauth2_tokens.consumer_section_title')}
        </h2>
        <Button
          type="button"
          variant="outline"
          size="xs"
          rounded
          onClick={() => {
            if (oauthKeysData) {
              setOpenConfirm(true)
            } else {
              onGenerateKeys()
            }
          }}
        >
          {oauthKeysData
            ? t('keys.oauth2_tokens.delete_key')
            : t('btn.generate_keys')}
        </Button>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <ReadOnlyInputField
          value={oauthKeysData?.consumerKey ?? ''}
          type="text"
          label={t('keys.oauth2_tokens.consumer_key_label')}
          placeholder=""
          copy={copy}
          copyNonce={copyNonce}
        />
        <ReadOnlyInputField
          value={oauthKeysData?.consumerSecret ?? ''}
          type="password"
          placeholder=""
          label={t('keys.oauth2_tokens.consumer_secret_label')}
          copy={copy}
          copyNonce={copyNonce}
        />
      </div>

      {applicationData.tier === 'SANDBOX' && (
        <div className="flex items-center gap-4">
          <Button
            type="button"
            variant="outline"
            size="xs"
            disabled={!oauthKeysData}
            rounded
            onClick={() =>
              generateAccessTokenMutation.mutate(
                {
                  consumerSecret: oauthKeysData?.consumerSecret ?? '',
                  validityPeriod: 3600,
                  revokeToken: null,
                  scopes: [],
                  additionalProperties:
                    oauthKeysData?.additionalProperties ?? {},
                },
                {
                  onSuccess: (data) => {
                    setAccessToken(data.data.accessToken)
                  },
                }
              )
            }
          >
            {t('keys.oauth2_tokens.generate_token')}
          </Button>
          <Button
            type="button"
            size="xs"
            variant={'outline'}
            rounded
            disabled={!oauthKeysData}
            linked
            className="font-semibold"
            onClick={openModal}
          >
            {t('keys.oauth2_tokens.curl_link')}
          </Button>
        </div>
      )}
      {accessToken && (
        <ReadOnlyInputField
          value={accessToken}
          type="password"
          label={t('keys.oauth2_tokens.access_token_label')}
          startAddon={t('keys.oauth2_tokens.access_token_addon')}
          description={t('keys.oauth2_tokens.access_token_description')}
          copy={copy}
          copyNonce={copyNonce}
        />
      )}
      <ConfirmModal
        open={openConfirm}
        onOpenChange={setOpenConfirm}
        title={t('confirm_delete_key.title')}
        description={t('confirm_delete_key.description')}
        onConfirm={() => {
          mutate.mutate()
        }}
        cancelTitle={t('btn.cancel')}
        confirmTitle={t('btn.delete')}
        icon={<DeleteDocument className="size-36" />}
      />
      {oauthKeysData && (
        <AccessTokenCURLModal
          open={isOpen}
          onOpenChange={closeModal}
          keyManagerData={keyManagerData}
          oauthKeysData={oauthKeysData}
        />
      )}
    </div>
  )
}
