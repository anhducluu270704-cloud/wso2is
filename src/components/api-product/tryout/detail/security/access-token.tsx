import { Field, FieldDescription, FieldLabel } from '@/share/ui/field'
import { Button } from '@/share/ui/button'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/share/ui/input-group'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { useGenerateAccessTokenMutation } from '@/services/application/application.mutations'

export default function AccessToken({
  accessToken,
  setAccessToken,
  app_id,
  key_mapping_id,
  consumer_secret,
  additional_properties,
}: Readonly<{
  accessToken: string
  setAccessToken: (accessToken: string) => void
  app_id: string
  key_mapping_id: string
  consumer_secret: string
  additional_properties: Record<string, any>
}>) {
  const t = useTranslations('api_product')
  const [show, setShow] = useState(false)
  const generateAccessTokenMutation = useGenerateAccessTokenMutation(
    app_id,
    key_mapping_id
  )

  return (
    <div className="flex items-center gap-2">
      <Field>
        <FieldLabel>{t('keys.oauth2_tokens.access_token_label')}</FieldLabel>
        <InputGroup>
          <InputGroupAddon align="inline-start">
            <span className="text-black-1 whitespace-nowrap">
              {t('keys.oauth2_tokens.access_token_addon')}
            </span>
          </InputGroupAddon>
          <InputGroupInput
            value={accessToken}
            onChange={(e) => setAccessToken(e.target.value)}
            size="xs"
            type={show ? 'text' : 'password'}
            data-password-toggle="none"
            placeholder=""
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton
              type="button"
              variant="secondary"
              size="icon-sm"
              onClick={() => setShow((v) => !v)}
            >
              {show ? <EyeOffIcon /> : <EyeIcon />}
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <FieldDescription>
          {t('keys.oauth2_tokens.access_token_description')}
        </FieldDescription>
      </Field>
      <Button
        size="xs"
        rounded
        onClick={() =>
          generateAccessTokenMutation.mutate(
            {
              consumerSecret: consumer_secret,
              validityPeriod: 3600,
              revokeToken: null,
              scopes: [],
              additionalProperties: additional_properties,
            },
            {
              onSuccess: (data) => {
                setAccessToken(data.data.accessToken)
              },
            }
          )
        }
      >
        {t('btn.get_access_token')}
      </Button>
    </div>
  )
}
