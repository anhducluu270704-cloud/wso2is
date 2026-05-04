'use client'

import { useTranslations } from 'next-intl'
import { Checkbox } from '@/share/ui/checkbox'

interface GrantTypesProps {
  listGrantTypes: string[]
  value?: string[] | null
  onChange: (value: string[]) => void
  tier: 'SANDBOX' | 'PRODUCTION'
}

export default function GrantTypes({
  listGrantTypes,
  value,
  onChange,
  tier,
}: Readonly<GrantTypesProps>) {
  const t = useTranslations('application')
  const selected = new Set(value ?? [])

  const handleChange = (id: string, checked: boolean) => {
    const next = new Set(selected)
    if (checked) next.add(id)
    else next.delete(id)
    onChange(Array.from(next))
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <h3 className="text-body-emphasize text-black-1">
          {t('keys.oauth2_tokens.grant_types_label')}
        </h3>
        <p className="text-body-helptext text-grey-6">
          {t('keys.oauth2_tokens.grant_types_description')}
        </p>
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 py-2">
        {listGrantTypes.map((grantType) => (
          <label
            key={grantType}
            className="flex items-center gap-2 text-body-body text-black-1"
          >
            <Checkbox
              checked={selected.has(grantType)}
              onCheckedChange={(checked) =>
                handleChange(grantType, checked === true)
              }
              disabled={tier === 'PRODUCTION'}
            />
            <span className="truncate">
              {t.has(`keys.oauth2_tokens.grant_type.${grantType}`)
                ? t(`keys.oauth2_tokens.grant_type.${grantType}`)
                : grantType}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
