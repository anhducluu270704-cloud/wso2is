export type AUTH_SYNC_EVENT = 'changed' | 'logout'

export type AUTH_ROLE = 'DEVELOPER' | 'BUSINESS_OWNER' | 'ADMIN'

export const AUTH_SCOPES: Record<AUTH_ROLE, string> = {
  DEVELOPER: 'apim:subscribe',
  BUSINESS_OWNER: 'apim:business',
  ADMIN: 'apim:admin',
}

export const AUTH_STATUS = ['PENDING'] as const
