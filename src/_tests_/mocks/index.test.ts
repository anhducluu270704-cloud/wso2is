
import {
  MOCK_ACCESS_TOKEN,
  MOCK_API_PRODUCT,
  MOCK_API_PRODUCT_LIST_RESPONSE,
  MOCK_APPLICATION_DETAIL,
  MOCK_APPLICATION_LIST_RESPONSE,
  MOCK_APPLICATION_REQUEST,
  MOCK_AUTH_FULL_INFO,
  MOCK_AUTH_INFO_BASE,
  MOCK_CHANGE_PASSWORD_REQUEST,
  MOCK_PROFILE_DETAIL,
  MOCK_PROFILE_USER_INFO_REQUEST,
  MOCK_SIGN_IN_REQUEST,
  MOCK_SIGN_UP_REQUEST,
  MOCK_SUPPORT_ITEM,
  MOCK_SUPPORT_LIST,
  MOCK_THROTTLING_POLICIES,
} from './index'

describe('test mocks exports', () => {
  it('exports auth mocks', () => {
    expect(MOCK_ACCESS_TOKEN).toContain('.')
    expect(MOCK_AUTH_INFO_BASE.refresh_token).toBeDefined()
    expect(MOCK_AUTH_FULL_INFO.user.sub).toBe('user123')
    expect(MOCK_SIGN_IN_REQUEST.username).toBe('user@example.com')
    expect(MOCK_SIGN_UP_REQUEST.role).toBe('business-owner')
  })

  it('exports application mocks', () => {
    expect(MOCK_APPLICATION_DETAIL.applicationId).toBe('app-123')
    expect(MOCK_APPLICATION_REQUEST.name).toBe('New Application')
    expect(MOCK_THROTTLING_POLICIES[0].name).toBe('10PerMin')
    expect(MOCK_APPLICATION_LIST_RESPONSE.data.list[0].name).toBe('Test App')
  })

  it('exports profile and support mocks', () => {
    expect(MOCK_PROFILE_DETAIL.company_name).toBe('Company Ltd')
    expect(MOCK_PROFILE_USER_INFO_REQUEST.phone).toBe('0901234567')
    expect(MOCK_CHANGE_PASSWORD_REQUEST.newPassword).toBe('NewPass1!')
    expect(MOCK_SUPPORT_ITEM.articleTitleEn).toContain('reset password')
    expect(MOCK_SUPPORT_LIST).toHaveLength(1)
  })

  it('exports api product mocks', () => {
    expect(MOCK_API_PRODUCT.id).toBe('api-1')
    expect(MOCK_API_PRODUCT_LIST_RESPONSE.data.list[0].name).toBe('Payment API')
  })
})
