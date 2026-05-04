
import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, jest } from '@jest/globals'

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

jest.mock('@/components/redirect', () => ({
  __esModule: true,
  default: ({ href }: { href: { pathname: string; params: any } }) => (
    <div>{`RedirectPage:${href.pathname}:${href.params.redirect}`}</div>
  ),
}))

describe('EUDashboardPage', () => {
  it('passes current pathname as redirect param to RedirectPage', async () => {
    const { usePathname } = await import('next/navigation')
    ;(usePathname as jest.Mock).mockReturnValue('/vi/some/path')
    const { default: EUDashboardPage } = await import('../../page')

    render(<EUDashboardPage />)

    expect(
      screen.getByText('RedirectPage:/api-products:/vi/some/path')
    ).toBeTruthy()
  })
})


