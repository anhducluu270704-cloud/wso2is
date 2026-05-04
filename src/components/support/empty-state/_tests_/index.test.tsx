
import React from 'react'
import { render, screen } from '@testing-library/react'
import { SupportEmptyState } from '../index'

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))

describe('support/empty-state', () => {
  it('render SupportEmptyState với searchQuery', () => {
    const { container } = render(<SupportEmptyState searchQuery="test query" />)
    expect(container.textContent).toContain('no_result_before')
    expect(container.textContent).toContain('test query')
    expect(container.textContent).toContain('no_result_after')
  })
})