
import React from 'react'
import { render, screen } from '@testing-library/react'
import { mockUseRouter, mockUseTranslations, MockProviders } from './test-utils'

describe('test-utils', () => {
  it('mockUseRouter trả về push, replace, back, refresh', () => {
    const router = mockUseRouter()
    expect(router.push).toBeDefined()
    expect(router.replace).toBeDefined()
    expect(router.back).toBeDefined()
    expect(router.refresh).toBeDefined()
    expect(typeof router.push).toBe('function')
  })

  it('mockUseTranslations trả về function nhận key trả về key', () => {
    const t = mockUseTranslations()
    expect(t('some.key')).toBe('some.key')
  })

  it('MockProviders render children', () => {
    render(
      <MockProviders>
        <span>Child</span>
      </MockProviders>
    )
    expect(screen.getByText('Child')).toBeInTheDocument()
  })
})
