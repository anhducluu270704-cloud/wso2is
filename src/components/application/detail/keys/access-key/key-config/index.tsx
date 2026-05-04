'use client'

import { useTranslations } from 'next-intl'
import GrantTypes from './grant-types'
import type {
  KeyManagerDetail,
  PropertyKey,
} from '@/services/application/application.schema'
import TokenExpiry from './token-expiry'
import ReadOnlyInputField from '@/share/components/input/read_only'
import type { UseCopyActions } from '@/share/hooks/use-copy'
import InputField from '@/share/components/input'

export default function KeyConfigSection({
  grantTypes,
  onGrantTypesChange,
  callbackUrl,
  onCallbackUrlChange,
  properties,
  onPropertiesChange,
  keyManagerData,
  copy,
  copyNonce,
  tier,
}: Readonly<
  {
    grantTypes: string[]
    onGrantTypesChange: (value: string[]) => void
    callbackUrl: string
    onCallbackUrlChange: (value: string) => void
    properties: PropertyKey
    onPropertiesChange: (value: PropertyKey) => void
    keyManagerData: KeyManagerDetail
    tier: 'SANDBOX' | 'PRODUCTION'
  } & UseCopyActions
>) {
  const t = useTranslations('application')
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-title-sm text-black-1 font-semibold">
        {t('keys.view_keys_title')}
      </h2>

      <div className="grid gap-8 md:grid-cols-2">
        <ReadOnlyInputField
          value={keyManagerData.tokenEndpoint}
          label={t('keys.config.table.rows.token_endpoint_label')}
          copy={copy}
          copyNonce={copyNonce}
        />
        <ReadOnlyInputField
          value={keyManagerData.revokeEndpoint}
          label={t('keys.config.table.rows.revoke_endpoint_label')}
          copy={copy}
          copyNonce={copyNonce}
        />
      </div>

      <GrantTypes
        listGrantTypes={keyManagerData.availableGrantTypes}
        value={grantTypes}
        onChange={onGrantTypesChange}
        tier={tier}
      />

      {grantTypes.includes('authorization_code') && (
        <InputField
          label={t('keys.oauth2_tokens.callback_url_label')}
          value={callbackUrl}
          onChange={(e) => onCallbackUrlChange(e.target.value)}
          description={t('keys.oauth2_tokens.callback_url_description')}
        />
      )}

      <TokenExpiry
        listProperties={keyManagerData.applicationConfiguration}
        value={properties}
        onChange={onPropertiesChange}
        tier={tier}
      />
    </div>
  )
}
