import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('../guide', () => ({
  __esModule: true,
  default: () => <div data-testid="guide-section" />,
}))

jest.mock('../swagger', () => ({
  __esModule: true,
  default: () => <div data-testid="swagger-section" />,
}))

jest.mock('../security', () => ({
  __esModule: true,
  default: () => <div data-testid="security-section" />,
}))

jest.mock('../provider', () => ({
  TryoutDetailProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="detail-provider">{children}</div>
  ),
}))

import TryoutDetail from '../index'

const scenarioDetail = {
  id: 'sid',
  scenario_key: 'sk',
  scenario_name: 'sn',
  active_version_id: 'avid',
  active_version: 1,
  api_id: 'aid',
  api_name: 'an',
}

describe('TryoutDetail', () => {
  it('bọc Guide, Security, Swagger trong provider', () => {
    render(
      <TryoutDetail
        scenarioDetail={scenarioDetail}
        api_id="a1"
        case_id="c1"
        app_id="p1"
      />,
    )
    expect(screen.getByTestId('detail-provider')).toBeInTheDocument()
    expect(screen.getByTestId('guide-section')).toBeInTheDocument()
    expect(screen.getByTestId('security-section')).toBeInTheDocument()
    expect(screen.getByTestId('swagger-section')).toBeInTheDocument()
  })
})
