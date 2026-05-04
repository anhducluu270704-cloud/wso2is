import React, { useState } from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import KeyConfigSection from '../index'
import type { KeyManagerDetail, PropertyKey } from '@/services/application/application.schema'
import { useCopy } from '@/share/hooks/use-copy'

const mockClipboardWriteText = jest.fn().mockResolvedValue(undefined)

jest.mock('next-intl', () => ({
  useTranslations: () => Object.assign((k: string) => k, { has: () => true }),
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

jest.mock('@/share/icons', () => ({
  CopyIcon: () => <span>Copy</span>,
}))

jest.mock('@/share/ui/input-group', () => ({
  InputGroup: ({ children }: any) => <div>{children}</div>,
  InputGroupAddon: ({ children }: any) => <div>{children}</div>,
  InputGroupInput: ({ value }: any) => <input value={value} disabled />,
  InputGroupButton: ({ children, onClick, type }: any) => (
    <button type={type || 'button'} onClick={onClick}>
      {children}
    </button>
  ),
}))

jest.mock('@/share/ui/checkbox', () => ({
  Checkbox: ({ checked, onCheckedChange }: any) => (
    <input type="checkbox" checked={checked} onChange={(e) => onCheckedChange(e.target.checked)} />
  ),
}))

jest.mock('@/share/components/input', () => ({
  __esModule: true,
  default: ({ label, value, onChange, disabled }: any) => (
    <label>
      {label}
      <input value={value} onChange={onChange} disabled={disabled} />
    </label>
  ),
}))

jest.mock('@/share/ui/select', () => ({
  Select: ({ children }: any) => <div>{children}</div>,
  SelectTrigger: ({ children }: any) => <button type="button">{children}</button>,
  SelectValue: () => <span>val</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}))

const keyManagerData: KeyManagerDetail = {
  id: 'km1',
  name: 'KM',
  type: 'RESIDENT',
  displayName: 'KM',
  description: '',
  enabled: true,
  availableGrantTypes: ['authorization_code', 'client_credentials', 'refresh_token'],
  tokenEndpoint: 'token',
  revokeEndpoint: 'revoke',
  userInfoEndpoint: null,
  enableTokenGeneration: true,
  enableTokenEncryption: false,
  enableTokenHashing: false,
  enableOAuthAppCreation: true,
  enableMapOAuthConsumerApps: false,
  applicationConfiguration: [
    { name: 'appAccessTokenExpiry', label: 'keys.oauth2_tokens.app_access_token_expiry_label', type: 'text', required: false, mask: false, multiple: false, tooltip: '', default: '10' },
  ],
  alias: null,
  additionalProperties: {},
  tokenType: 'JWT',
}

function KeyConfigHarness({ initialGrantTypes }: { initialGrantTypes: string[] }) {
  const { copy, copyNonce } = useCopy()
  const [grantTypes, setGrantTypes] = useState<string[]>(initialGrantTypes)
  const [properties, setProperties] = useState<PropertyKey>({ appAccessTokenExpiry: '10' })
  const [callbackUrl, setCallbackUrl] = useState('https://cb.example')

  return (
    <KeyConfigSection
      grantTypes={grantTypes}
      onGrantTypesChange={setGrantTypes}
      callbackUrl={callbackUrl}
      onCallbackUrlChange={setCallbackUrl}
      properties={properties}
      onPropertiesChange={setProperties}
      keyManagerData={keyManagerData}
      copy={copy}
      copyNonce={copyNonce}
      tier="SANDBOX"
    />
  )
}

describe('application/detail/keys/access-key/key-config', () => {
  it('renders config and allows callbackUrl edit when authorization_code is selected', async () => {
    Object.assign(navigator, { clipboard: { writeText: mockClipboardWriteText } })

    render(<KeyConfigHarness initialGrantTypes={['authorization_code']} />)

    const callbackInput = screen.getByLabelText('keys.oauth2_tokens.callback_url_label') as HTMLInputElement
    expect(callbackInput).not.toBeDisabled()

    fireEvent.change(callbackInput, { target: { value: 'https://new-cb' } })
    expect(callbackInput.value).toBe('https://new-cb')

    const copyButtons = screen.getAllByRole('button', { name: 'Copy' })
    await act(async () => {
      fireEvent.click(copyButtons[0])
      await Promise.resolve()
    })
    expect(mockClipboardWriteText).toHaveBeenCalledWith('token')
  })

  it('disables callbackUrl input when authorization_code is not selected', () => {
    render(<KeyConfigHarness initialGrantTypes={['client_credentials']} />)

    const callbackInput = screen.getByLabelText('keys.oauth2_tokens.callback_url_label') as HTMLInputElement
    expect(callbackInput).toBeDisabled()
  })
})
