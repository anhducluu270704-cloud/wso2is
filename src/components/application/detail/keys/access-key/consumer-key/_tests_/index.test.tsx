import React from 'react'
import { act, fireEvent, render, screen } from '@testing-library/react'
import ConsumerKeySection from '../index'
import type { ApplicationDetail, OauthKeyDetail } from '@/services/application/application.schema'
import { useCopy } from '@/share/hooks/use-copy'

const mockDeleteMutate = jest.fn()
const mockGenerateAccessTokenMutate = jest.fn()
const mockOnGenerateKeys = jest.fn()
const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
}

jest.mock('next-intl', () => ({
  useTranslations: () => Object.assign((k: string) => k, { has: () => true }),
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

jest.mock('@/services/application/application.mutations', () => ({
  useDeleteOAuthKeyMutation: () => ({ mutate: mockDeleteMutate }),
  useGenerateAccessTokenMutation: () => ({ mutate: mockGenerateAccessTokenMutate }),
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick, disabled, ...props }: any) => (
    <button type="button" onClick={onClick} disabled={disabled} {...props}>
      {children}
    </button>
  ),
}))

jest.mock('@/share/ui/input-group', () => ({
  InputGroup: ({ children }: any) => <div>{children}</div>,
  InputGroupAddon: ({ children }: any) => <div>{children}</div>,
  InputGroupButton: ({ children, ...props }: any) => (
    <button type={props.type || 'button'} onClick={props.onClick}>
      {children}
    </button>
  ),
  InputGroupInput: ({ value, type }: any) => <input value={value} type={type} readOnly disabled />,
}))

jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: any) => <div>{children}</div>,
  FieldLabel: ({ children }: any) => <label>{children}</label>,
  FieldDescription: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/share/components/modal/confirm', () => ({
  __esModule: true,
  default: ({ open, onConfirm }: { open: boolean; onConfirm: () => void }) =>
    open ? <button onClick={onConfirm}>confirm-delete</button> : null,
}))

jest.mock('../modal', () => ({
  __esModule: true,
  default: () => <div data-testid="curl-modal" />,
}))

jest.mock('@/share/icons', () => ({
  CopyIcon: () => <span>Copy</span>,
  DeleteDocument: () => <span>DeleteDoc</span>,
}))

jest.mock('lucide-react', () => ({
  CopyIcon: () => <span>Copy</span>,
  EyeIcon: () => <span>Eye</span>,
  EyeOffIcon: () => <span>EyeOff</span>,
}))

const oauthKeysData: OauthKeyDetail = {
  keyMappingId: 'km-1',
  keyManager: 'mgr',
  consumerKey: 'mock_consumer_key',
  consumerSecret: 'mock_consumer_secret',
  supportedGrantTypes: ['password'],
  callbackUrl: 'http://cb',
  keyState: 'ACTIVE',
  keyType: 'SANDBOX',
  mode: 'm',
  groupId: null,
  token: { accessToken: null, tokenScopes: [], validityTime: 0 },
  additionalProperties: {},
}

const applicationData: ApplicationDetail = {
  name: 'App',
  applicationId: 'app-1',
  tier: 'PRODUCTION',
  throttlingPolicy: 'Bronze',
  description: null,
  status: 'APPROVED',
  groups: [],
  subscriptionCount: 0,
  attributes: {},
  owner: 'o',
  tokenType: 'JWT',
}

function ConsumerKeyHarness({ oauth }: { oauth?: OauthKeyDetail }) {
  const { copy, copyNonce } = useCopy()
  return (
    <ConsumerKeySection
      applicationData={applicationData}
      oauthKeysData={oauth}
      keyManagerData={{
        alias: null,
        tokenEndpoint: 'https://example.com/oauth2/token',
        type: 'Resident',
      } as any}
      copy={copy}
      copyNonce={copyNonce}
      onGenerateKeys={mockOnGenerateKeys}
    />
  )
}

function renderHarness(oauth?: OauthKeyDetail) {
  return render(
    <ConsumerKeyHarness oauth={oauth} />
  )
}

describe('application/detail/keys/access-key/consumer-key', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: mockClipboard })
    mockClipboard.writeText.mockClear()
    mockDeleteMutate.mockClear()
    mockGenerateAccessTokenMutate.mockClear()
    mockOnGenerateKeys.mockClear()
  })

  it('copies keys, toggles secret, and confirms delete when oauth key exists', async () => {
    renderHarness(oauthKeysData)

    const secretInput = screen.getByDisplayValue('mock_consumer_secret') as HTMLInputElement
    expect(secretInput.type).toBe('password')

    const copyButtons = screen.getAllByRole('button', { name: 'Copy' })
    await act(async () => {
      fireEvent.click(copyButtons[0])
      await Promise.resolve()
    })
    expect(mockClipboard.writeText).toHaveBeenLastCalledWith('mock_consumer_key')

    const eyeBtn = screen.getByRole('button', { name: 'Eye' })
    fireEvent.click(eyeBtn)
    expect(screen.getByRole('button', { name: 'EyeOff' })).toBeInTheDocument()
    expect(secretInput.type).toBe('text')

    fireEvent.click(screen.getByRole('button', { name: 'keys.oauth2_tokens.delete_key' }))
    fireEvent.click(screen.getByRole('button', { name: 'confirm-delete' }))
    expect(mockDeleteMutate).toHaveBeenCalledTimes(1)
    expect(screen.getByTestId('curl-modal')).toBeInTheDocument()
  })

  it('calls onGenerateKeys and disables oauth-only actions when oauth key is missing', () => {
    renderHarness(undefined)

    fireEvent.click(screen.getByRole('button', { name: 'btn.generate_keys' }))
    expect(mockOnGenerateKeys).toHaveBeenCalledTimes(1)

    expect(screen.getByRole('button', { name: 'keys.oauth2_tokens.generate_token' })).toBeDisabled()
    expect(screen.getByRole('button', { name: 'keys.oauth2_tokens.curl_link' })).toBeDisabled()
    expect(screen.queryByTestId('curl-modal')).not.toBeInTheDocument()
  })
})
