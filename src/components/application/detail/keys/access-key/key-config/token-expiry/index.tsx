'use client'

import {
  ConfigurationDetail,
  PropertyKey,
} from '@/services/application/application.schema'
import InputField from '@/share/components/input'
import { Checkbox } from '@/share/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/share/ui/select'
import { useTranslations } from 'next-intl'

interface TokenExpiryProps {
  listProperties: ConfigurationDetail[]
  value: PropertyKey
  onChange: (value: PropertyKey) => void
  tier: 'SANDBOX' | 'PRODUCTION'
}

function selectValueToPropertyValue(selected: string): boolean | string {
  if (selected === 'true') return true
  if (selected === 'false') return false
  return selected
}

export default function TokenExpiry({
  listProperties,
  value,
  onChange,
  tier,
}: Readonly<TokenExpiryProps>) {
  const t = useTranslations('application')
  const checkboxProperties = listProperties.filter(
    (property) => property.type === 'checkbox'
  )
  const inputProperties = listProperties.filter(
    (property) => property.type !== 'checkbox'
  )

  const getPropertyValue = (property: ConfigurationDetail) => {
    if (Object.hasOwn(value, property.name)) {
      return value[property.name]
    }
    const defaultWhenUnset = property.type === 'checkbox' ? false : ''
    return property.default ?? defaultWhenUnset
  }

  const updateProperty = (name: string, nextValue: unknown) => {
    onChange({
      ...(value ?? {}),
      [name]: nextValue,
    })
  }

  const normalizeBoolean = (raw: unknown) => raw === true || raw === 'true'

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-x-8 gap-y-4 md:grid-cols-2">
        {inputProperties.map((property) => (
          <div key={property.name}>
            {property.type === 'select' ? (
              <div className="flex flex-col gap-2">
                <label className="text-body-emphasize text-black-1">
                  {t.has(`keys.oauth2_tokens.${property.name}`)
                    ? t(`keys.oauth2_tokens.${property.name}`)
                    : property.label}
                </label>
                <Select
                  value={String(getPropertyValue(property))}
                  onValueChange={(selected) =>
                    updateProperty(
                      property.name,
                      selectValueToPropertyValue(selected)
                    )
                  }
                  disabled={tier === 'PRODUCTION'}
                >
                  <SelectTrigger size="sm" className="bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(property.values ?? []).map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ) : (
              <InputField
                label={
                  t.has(`keys.oauth2_tokens.${property.name}`)
                    ? t(`keys.oauth2_tokens.${property.name}`)
                    : property.label
                }
                value={String(getPropertyValue(property))}
                onChange={(e) => updateProperty(property.name, e.target.value)}
                disabled={tier === 'PRODUCTION'}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-2">
        {checkboxProperties.map((property) => (
          <label
            key={property.name}
            className="flex items-center gap-2 text-body-body text-black-1"
          >
            <Checkbox
              checked={normalizeBoolean(getPropertyValue(property))}
              onCheckedChange={(checked) =>
                updateProperty(
                  property.name,
                  checked === true ? 'true' : 'false'
                )
              }
            />
            <span className="truncate">
              {t.has(`keys.oauth2_tokens.${property.name}`)
                ? t(`keys.oauth2_tokens.${property.name}`)
                : property.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  )
}
