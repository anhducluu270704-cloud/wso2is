
import React from 'react'
import { render, screen } from '@testing-library/react'
import EUFooter from '../index'

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('@/constants/footer', () => ({
  FOOTER_LINKS: [
    { key: 'footer.termsconditions', href: 'https://example.com/terms' },
    { key: 'footer.privacypolicy', href: 'https://example.com/privacy' },
  ],
  HOTLINE: '1900',
  SOCIAL_ICONS: [
    {
      alt: 'Facebook',
      href: 'https://example.com/facebook',
      Icon: (props: any) => <svg data-testid="facebook-icon" {...props} />,
    },
    {
      alt: 'LinkedIn',
      href: 'https://example.com/linkedin',
      Icon: (props: any) => <svg data-testid="linkedin-icon" {...props} />,
    },
  ],
}))
jest.mock('@/share/components/language-switch.tsx', () => {
  const R = require('react')
  return { __esModule: true, default: () => R.createElement('div', null, 'LocalesDropdown') }
})
jest.mock('next/image', () => {
  const R = require('react')
  return { __esModule: true, default: (p: any) => R.createElement('img', { alt: p.alt, src: p.src }) }
})
jest.mock('next/link', () => {
  const R = require('react')
  return {
    __esModule: true,
    default: (props: any) => R.createElement('a', { ...props, href: props.href }, props.children),
  }
})

describe('share/layout/end-user/footer', () => {
  it('render EUFooter', () => {
    render(<EUFooter />)

    expect(screen.getByRole('contentinfo')).toBeInTheDocument()
    expect(screen.getByText('LocalesDropdown')).toBeInTheDocument()
    expect(screen.getByText('footer.termsconditions')).toBeInTheDocument()
    expect(screen.getByText('footer.privacypolicy')).toBeInTheDocument()
    expect(screen.getByLabelText('Facebook')).toHaveAttribute(
      'href',
      'https://example.com/facebook'
    )
    expect(screen.getByLabelText('LinkedIn')).toHaveAttribute(
      'href',
      'https://example.com/linkedin'
    )
    expect(screen.getByText('footer.hotline')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '1900' })).toHaveAttribute('href', 'tel:1900')
  })
})
