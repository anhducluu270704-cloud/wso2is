export const MOCK_ACCESS_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyMTIzIiwiYXV0IjoiYXBwbGljYXRpb24iLCJpc3MiOiJodHRwOi8vdGVzdC5jb20iLCJjbGllbnRfaWQiOiJjbGkiLCJhdWQiOiJhdWQiLCJuYmYiOjE2MDAwMDAwMDAsImF6cCI6ImF6cCIsIm9yZ19pZCI6Im9yZzEiLCJleHAiOjE5MDAwMDAwMDAsIm9yZ19uYW1lIjoiVGVzdCBPcmciLCJpYXQiOjE2MDAwMDAwMDAsImp0aSI6Imp0aTEiLCJvcmdfaGFuZGxlIjoidGVzdCIsImZ1bGxuYW1lIjoiTmd1eWVuIFZhbiBBIn0.signature'

export const MOCK_USER_INFO = {
  emails: 'user@example.com',
  businessSector: 'Finance',
  companyAddress: '1 Test St',
  companyName: 'Test Co',
  fullName: 'Test User',
  phoneNumbers: '0900000000',
  representativeEmail: 'rep@example.com',
  representativeMobile: '0900000001',
  representativeName: 'Rep Name',
  taxcode: '0123456789',
  userName: 'testuser',
}

export const MOCK_AUTH_INFO_BASE = {
  access_token: MOCK_ACCESS_TOKEN,
  id_token: 'mock-id-token-123',
  expires_in: 3600,
  refresh_token: 'mock-refresh-token-456',
  scope: 'openid',
  token_type: 'Bearer',
  user_info: MOCK_USER_INFO,
}

export const MOCK_AUTH_FULL_INFO = {
  ...MOCK_AUTH_INFO_BASE,
  user: {
    sub: 'user123',
    aut: 'application',
    iss: 'http://test.com',
    client_id: 'cli',
    aud: 'aud',
    nbf: 1600000000,
    azp: 'azp',
    org_id: 'org1',
    exp: 1900000000,
    org_name: 'Test Org',
    iat: 1600000000,
    jti: 'jti1',
    org_handle: 'test',
  },
  refresh_at: Date.now() + 3500000,
}

export const MOCK_SIGN_IN_REQUEST = {
  username: 'user@example.com',
  password: 'ValidPass1!',
}

export const MOCK_SIGN_UP_REQUEST = {
  fullName: 'Nguyen Van A',
  email: 'user@company.com',
  password: 'ValidPass1!',
  confirmPassword: 'ValidPass1!',
  role: 'business-owner' as const,
  companyName: 'Company Ltd',
  companyEmail: 'company@company.com',
  mobileNumber: '0901234567',
  taxNumber: '0123456789',
  tncAccepted: true as const,
}
