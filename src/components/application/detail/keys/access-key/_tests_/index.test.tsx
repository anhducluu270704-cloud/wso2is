
jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/share/ui/spinner', () => ({
  SpinnerCustom: () => <div data-testid="spinner" />,
}))

jest.mock('@/share/ui/tabs', () => ({
  Tabs: ({ children }: any) => <div>{children}</div>,
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children }: any) => <button type="button">{children}</button>,
  TabsContent: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('../consumer-key', () => ({
  __esModule: true,
  default: () => <div data-testid="consumer-key-section" />,
}))
jest.mock('../key-config', () => ({
  __esModule: true,
  default: () => <div data-testid="key-config-section" />,
}))

jest.mock('../hook', () => ({
  useOAuth2TokensSection: () => ({
    grantTypes: [],
    setGrantTypes: jest.fn(),
    properties: {},
    setProperties: jest.fn(),
    isConfigurationUnchanged: false,
    onPrimaryAction: jest.fn(),
  }),
}))

jest.mock('@/services/application/application.query-options', () => {
  const pagination = { offset: 0, limit: 10, total: 1, next: '', previous: '' }
  const keyManagerRow = {
    id: 'km1',
    name: 'KM',
    type: 'RESIDENT',
    displayName: 'KM',
    description: '',
    enabled: true,
    availableGrantTypes: ['password'],
    tokenEndpoint: 'http://t',
    revokeEndpoint: 'http://r',
    userInfoEndpoint: null,
    enableTokenGeneration: true,
    enableTokenEncryption: false,
    enableTokenHashing: false,
    enableOAuthAppCreation: true,
    enableMapOAuthConsumerApps: false,
    applicationConfiguration: [],
    alias: null,
    additionalProperties: {},
    tokenType: 'JWT',
  }
  const oauthSandboxRow = {
    keyMappingId: 'k1',
    keyManager: 'KM',
    consumerKey: 'ck',
    consumerSecret: 'cs',
    supportedGrantTypes: ['password'],
    callbackUrl: 'http://cb',
    keyState: 'ACTIVE',
    keyType: 'SANDBOX',
    mode: 'm',
    groupId: null,
    token: { accessToken: null, tokenScopes: [], validityTime: 0 },
    additionalProperties: {},
  }
  const listPayload = {
    count: 1,
    list: [keyManagerRow],
    pagination,
  }
  const apiOk = { message: 'OK', code: '200', data: listPayload }
  const oauthListPayload = {
    count: 1,
    list: [oauthSandboxRow],
    pagination,
  }
  const oauthApiOk = { message: 'OK', code: '200', data: oauthListPayload }
  return {
    useGetKeyManger: () => ({
      data: apiOk,
      isLoading: false,
      isError: false,
      isSuccess: true,
    }),
    useGetOauthKeys: () => ({
      data: oauthApiOk,
      isLoading: false,
      isError: false,
      isSuccess: true,
    }),
  }
})

import React from 'react'
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { ApplicationDetail } from '@/services/application/application.schema'

const applicationDataStub = (
  overrides: Partial<ApplicationDetail> = {},
): ApplicationDetail => ({
  name: 'App',
  applicationId: 'app-1',
  tier: 'SANDBOX',
  throttlingPolicy: 'Bronze',
  description: null,
  status: 'APPROVED',
  groups: [],
  subscriptionCount: 0,
  attributes: {},
  owner: 'o',
  tokenType: 'JWT',
  ...overrides,
})

function wrapper(ui: React.ReactElement) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return <QueryClientProvider client={client}>{ui}</QueryClientProvider>
}

describe('application/detail/keys/access-key', () => {
  it('renders consumer key section and key config section', async () => {
    const { default: OAuth2TokensSection } = await import('../index')
    render(wrapper(<OAuth2TokensSection applicationData={applicationDataStub()} />))
    expect(screen.getByTestId('consumer-key-section')).toBeInTheDocument()
    expect(screen.getByTestId('key-config-section')).toBeInTheDocument()
  })
})
