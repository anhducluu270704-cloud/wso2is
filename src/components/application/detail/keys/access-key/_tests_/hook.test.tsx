
import { act, renderHook } from '@testing-library/react'

import { DEFAULT_GRANT_TYPES } from '@/constants/application'
import type {
  ApplicationDetail,
  KeyManagerDetail,
  OauthKeyDetail,
} from '@/services/application/application.schema'

import * as mutations from '@/services/application/application.mutations'
import { useOAuth2TokensSection } from '../hook'

const mockGenerateMutate = jest.fn()
const mockUpdateMutate = jest.fn()

jest.mock('@/services/application/application.mutations', () => ({
  useGenerateKeysMutation: jest.fn(() => ({ mutate: mockGenerateMutate })),
  useUpdateConfigurationMutation: jest.fn(() => ({
    mutate: mockUpdateMutate,
  })),
}))

const keyManager = { name: 'KM-1' } as KeyManagerDetail

function appDetail(overrides: Partial<ApplicationDetail> = {}): ApplicationDetail {
  return {
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
  }
}

function makeOauth(overrides: Partial<OauthKeyDetail> = {}): OauthKeyDetail {
  return {
    keyMappingId: 'map-1',
    keyManager: 'KM-1',
    consumerKey: 'ck',
    consumerSecret: 'cs',
    supportedGrantTypes: ['authorization_code', 'refresh_token'],
    callbackUrl: 'https://cb.example/oauth',
    keyState: 'ACTIVE',
    keyType: 'SANDBOX',
    mode: 'test',
    groupId: null,
    token: {
      accessToken: null,
      tokenScopes: [],
      validityTime: 3600,
    },
    additionalProperties: {
      appAccessTokenExpiry: '10',
      pkceEnabled: false,
    },
    ...overrides,
  }
}

describe('application/detail/keys/access-key/hook', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('không oauthKeysData: DEFAULT_GRANT_TYPES, properties rỗng, mutation với keyMappingId rỗng', () => {
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail({ applicationId: 'app-1' }), keyManager, undefined),
    )

    expect(result.current.grantTypes).toEqual(DEFAULT_GRANT_TYPES)
    expect(result.current.properties).toEqual({})
    expect(result.current.isConfigurationUnchanged).toBe(true)

    expect(mutations.useGenerateKeysMutation).toHaveBeenCalledWith('app-1')
    expect(mutations.useUpdateConfigurationMutation).toHaveBeenCalledWith(
      'app-1',
      '',
    )
  })

  it('oauthKeysData: dùng supportedGrantTypes và additionalProperties', () => {
    const oauth = makeOauth()
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail({ applicationId: 'app-2' }), keyManager, oauth),
    )

    expect(result.current.grantTypes).toEqual(oauth.supportedGrantTypes)
    expect(result.current.properties).toEqual(oauth.additionalProperties)
    expect(mutations.useUpdateConfigurationMutation).toHaveBeenCalledWith(
      'app-2',
      'map-1',
    )
  })

  it('supportedGrantTypes rỗng → fallback DEFAULT_GRANT_TYPES', () => {
    const oauth = makeOauth({ supportedGrantTypes: [] })
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )

    expect(result.current.grantTypes).toEqual(DEFAULT_GRANT_TYPES)
  })

  it('useEffect: đổi oauthKeysData cập nhật grantTypes, callbackUrl và properties', () => {
    const oauthA = makeOauth({ keyMappingId: 'a' })
    const oauthB = makeOauth({
      keyMappingId: 'b',
      supportedGrantTypes: ['implicit'],
      callbackUrl: 'https://cb.other/oauth',
      additionalProperties: { x: '1' },
    })

    const { result, rerender } = renderHook(
      ({ oauth }: { oauth: OauthKeyDetail }) =>
        useOAuth2TokensSection(appDetail(), keyManager, oauth),
      { initialProps: { oauth: oauthA } },
    )

    expect(result.current.grantTypes).toEqual(oauthA.supportedGrantTypes)

    rerender({ oauth: oauthB })

    expect(result.current.grantTypes).toEqual(['implicit'])
    expect(result.current.callbackUrl).toBe('https://cb.other/oauth')
    expect(result.current.properties).toEqual({ x: '1' })
  })

  it('onGenerateKeys: không oauth → generateMutation.mutate', () => {
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail({ tier: 'SANDBOX' }), keyManager, undefined),
    )

    act(() => {
      result.current.onGenerateKeys()
    })

    expect(mockGenerateMutate).toHaveBeenCalledTimes(1)
    expect(mockGenerateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        keyType: 'SANDBOX',
        keyManager: 'KM-1',
        grantTypesToBeSupported: DEFAULT_GRANT_TYPES,
        callbackUrl: '',
        additionalProperties: {},
      }),
    )
    expect(mockUpdateMutate).not.toHaveBeenCalled()
  })

  it('onUpdateConfiguration: có oauth → updateConfigurationMutation.mutate', () => {
    const oauth = makeOauth()
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )

    act(() => {
      result.current.onUpdateConfiguration()
    })

    expect(mockUpdateMutate).toHaveBeenCalledTimes(1)
    expect(mockUpdateMutate).toHaveBeenCalledWith(
      expect.objectContaining({
        keyType: oauth.keyType,
        keyManager: 'KM-1',
        supportedGrantTypes: oauth.supportedGrantTypes,
        callbackUrl: oauth.callbackUrl,
        additionalProperties: oauth.additionalProperties,
      }),
    )
    expect(mockGenerateMutate).not.toHaveBeenCalled()
  })

  it('isConfigurationUnchanged: false khi đổi grantTypes', () => {
    const oauth = makeOauth()
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )

    expect(result.current.isConfigurationUnchanged).toBe(true)

    act(() => {
      result.current.setGrantTypes([...oauth.supportedGrantTypes, 'extra'])
    })

    expect(result.current.isConfigurationUnchanged).toBe(false)
  })

  it('isConfigurationUnchanged: false khi đổi properties', () => {
    const oauth = makeOauth()
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )

    act(() => {
      result.current.setProperties({
        ...oauth.additionalProperties,
        appAccessTokenExpiry: '99',
      })
    })

    expect(result.current.isConfigurationUnchanged).toBe(false)
  })

  it('isConfigurationUnchanged: false khi đổi callbackUrl', () => {
    const oauth = makeOauth()
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )

    expect(result.current.isConfigurationUnchanged).toBe(true)

    act(() => {
      result.current.setCallbackUrl(`${oauth.callbackUrl}/v2`)
    })

    expect(result.current.isConfigurationUnchanged).toBe(false)
  })

  it('isConfigurationUnchanged: false khi cùng số key nhưng tên key khác (sort)', () => {
    const oauth = makeOauth({
      additionalProperties: {
        appAccessTokenExpiry: '10',
        pkceEnabled: false,
      },
    })
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )

    act(() => {
      result.current.setProperties({
        appAccessTokenExpiry: '10',
        otherKey: 'x',
      })
    })

    expect(result.current.isConfigurationUnchanged).toBe(false)
  })

  it('isGrantTypesUnchanged: cùng tập khác thứ tự vẫn true', () => {
    const oauth = makeOauth({
      supportedGrantTypes: ['b', 'a'],
    })
    const { result } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )

    act(() => {
      result.current.setGrantTypes(['a', 'b'])
    })

    expect(result.current.isConfigurationUnchanged).toBe(true)
  })

  it('generateKeysData / updateConfigurationData: callbackUrl từ oauth hoặc rỗng', () => {
    const { result: noOauth } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, undefined),
    )
    act(() => {
      noOauth.current.onGenerateKeys()
    })
    expect(mockGenerateMutate).toHaveBeenLastCalledWith(
      expect.objectContaining({ callbackUrl: '' }),
    )

    mockGenerateMutate.mockClear()
    const oauth = makeOauth({ callbackUrl: 'https://x' })
    const { result: withOauth } = renderHook(() =>
      useOAuth2TokensSection(appDetail(), keyManager, oauth),
    )
    act(() => {
      withOauth.current.onUpdateConfiguration()
    })
    expect(mockUpdateMutate).toHaveBeenLastCalledWith(
      expect.objectContaining({ callbackUrl: 'https://x' }),
    )
  })
})
