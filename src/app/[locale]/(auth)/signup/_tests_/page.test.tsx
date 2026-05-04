
import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('@/components/auth/sign-up', () => ({
  __esModule: true,
  default: () => <div>SignUpWrapper</div>,
}))

jest.mock('@/components/auth/sign-up/status', () => ({
  __esModule: true,
  default: ({ token }: { token: string }) => (
    <div>{`SignUpStatus:${token}`}</div>
  ),
}))

type SignupPageProps = Parameters<typeof import('../page').default>[0]

describe('app/[locale]/(auth)/signup/page', () => {
  it('exports metadata', async () => {
    const { metadata } = await import('../page')

    expect(metadata).toEqual({ title: 'Signup', description: '' })
  })

  it('renders SignUpWrapper when token is missing', async () => {
    const { default: SignupPage } = await import('../page')

    const element = await SignupPage({
      searchParams: Promise.resolve({}),
    } as SignupPageProps)

    render(<>{element}</>)
    expect(screen.getByText('SignUpWrapper')).toBeInTheDocument()
  })

  it('renders SignUpWrapper when token is empty string', async () => {
    const { default: SignupPage } = await import('../page')

    const element = await SignupPage({
      searchParams: Promise.resolve({ token: '' }),
    } as SignupPageProps)

    render(<>{element}</>)
    expect(screen.getByText('SignUpWrapper')).toBeInTheDocument()
  })

  it('renders SignUpWrapper when token is whitespace only (trimmed empty)', async () => {
    const { default: SignupPage } = await import('../page')
    const token = '  \t '

    const element = await SignupPage({
      searchParams: Promise.resolve({ token }),
    } as SignupPageProps)

    render(<>{element}</>)
    expect(screen.getByText('SignUpWrapper')).toBeInTheDocument()
    expect(screen.queryByText(/SignUpStatus:/)).not.toBeInTheDocument()
  })

  it('renders SignUpStatus with trimmed searchParams token', async () => {
    const { default: SignupPage } = await import('../page')
    const token = '  invite-xyz  '

    const element = await SignupPage({
      searchParams: Promise.resolve({ token }),
    } as SignupPageProps)

    render(<>{element}</>)

    expect(screen.getByText('SignUpStatus:invite-xyz')).toBeInTheDocument()
    expect(screen.queryByText('SignUpWrapper')).not.toBeInTheDocument()
  })
})
