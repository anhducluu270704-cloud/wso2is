
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { OauthKeyDetail } from '@/services/application/application.schema'

import AccessTokenCURLModal from '../index'
import { TooltipProvider } from '@/share/ui/tooltip'

const mockClipboard = {
  writeText: jest.fn().mockResolvedValue(undefined),
}

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('sonner', () => ({
  toast: { success: jest.fn(), error: jest.fn() },
}))

jest.mock('@/share/components/modal', () => ({
  __esModule: true,
  default: ({ children, title, open }: any) =>
    open ? (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    ) : null,
}))

jest.mock('@/share/components/form', () => ({
  __esModule: true,
  default: ({ children, ...rest }: any) => <form {...rest}>{children}</form>,
}))

jest.mock('@/share/icons', () => ({
  CopyIcon: () => <span data-testid="copy-icon" />,
}))

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick, type }: any) => (
    <button type={type ?? 'button'} onClick={onClick}>
      {children}
    </button>
  ),
}))

const oauthKeysData: OauthKeyDetail = {
  keyMappingId: 'km-1',
  keyManager: 'mgr',
  consumerKey: 'ck',
  consumerSecret: 'cs',
  supportedGrantTypes: ['client_credentials'],
  callbackUrl: 'http://cb',
  keyState: 'ACTIVE',
  keyType: 'SANDBOX',
  mode: 'm',
  groupId: null,
  token: { accessToken: null, tokenScopes: [], validityTime: 0 },
  additionalProperties: {},
}

describe('AccessTokenCURLModal', () => {
  beforeEach(() => {
    Object.assign(navigator, { clipboard: mockClipboard })
    mockClipboard.writeText.mockClear()
  })

  it('Base64 dùng button (không phải anchor), bật aria-expanded và hiển thị chuỗi sau khi bấm', async () => {
    const expectedB64 = window.btoa('ck:cs')

    render(
      <TooltipProvider>
        <AccessTokenCURLModal
          open
          onOpenChange={() => {}}
          keyManagerData={{
            alias: null,
            tokenEndpoint: 'https://oauth.example/token',
            type: 'Resident',
          }}
          oauthKeysData={oauthKeysData}
        />
      </TooltipProvider>,
    )

    const toggles = screen.getAllByRole('button', {
      name: /Base64\(consumer-key:consumer-secret\)/,
    })
    expect(toggles.length).toBe(2)

    expect(
      screen.queryAllByRole('link', { name: /Base64/ }),
    ).toHaveLength(0)

    await userEvent.click(toggles[0])

    expect(toggles[0]).toHaveAttribute('aria-expanded', 'true')
    expect(screen.getAllByText(new RegExp(expectedB64)).length).toBeGreaterThan(
      0,
    )
  })

  it('nút copy ghi clipboard với Authorization Basic', async () => {
    render(
      <TooltipProvider>
        <AccessTokenCURLModal
          open
          onOpenChange={() => {}}
          keyManagerData={{
            alias: null,
            tokenEndpoint: 'https://oauth.example/token',
            type: 'Resident',
          }}
          oauthKeysData={oauthKeysData}
        />
      </TooltipProvider>,
    )

    const toggles = screen.getAllByRole('button', {
      name: /Base64\(consumer-key:consumer-secret\)/,
    })
    await userEvent.click(toggles[0])

    const copyIcons = screen.getAllByTestId('copy-icon')
    expect(copyIcons.length).toBeGreaterThanOrEqual(2)
    const firstCopyBtn = copyIcons[0].closest('button')
    expect(firstCopyBtn).toBeTruthy()
    await userEvent.click(firstCopyBtn!)

    expect(mockClipboard.writeText).toHaveBeenCalled()
    const arg = mockClipboard.writeText.mock.calls[0][0]
    expect(arg).toContain('Authorization: Basic')
    expect(arg).toContain(window.btoa('ck:cs'))
  })
})
