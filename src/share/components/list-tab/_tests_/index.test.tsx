
jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn() }),
  usePathname: () => '/en/application/app-1',
}))

let mockSearchParams = new URLSearchParams('active=two')
jest.mock('next/navigation', () => ({
  useSearchParams: () => mockSearchParams,
}))

import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ListTab from '../index'

jest.mock('@/share/ui/tabs', () => ({
  Tabs: ({ value, onValueChange, children }: any) => (
    <div>
      <div data-testid="tabs-value">{value}</div>
      <button onClick={() => onValueChange?.('two')}>set-two</button>
      <button onClick={() => onValueChange?.('disabled')}>set-disabled</button>
      {children}
    </div>
  ),
  TabsList: ({ children }: any) => <div>{children}</div>,
  TabsTrigger: ({ children, disabled, value }: any) => (
    <button disabled={disabled} data-value={value}>
      {children}
    </button>
  ),
  TabsContent: ({ children, value }: any) => (
    <div data-testid={`content-${value}`}>{children}</div>
  ),
}))

describe('share/components/list-tab', () => {
  beforeEach(() => {
    mockSearchParams = new URLSearchParams('active=two')
  })

  it('uses active query when selectable', async () => {
    const user = userEvent.setup()
    render(
      <ListTab
        listItems={[
          { id: 'one', label: 'one', value: 'one', content: <div>One</div>, icon: null },
          { id: 'two', label: 'two', value: 'two', content: <div>Two</div>, icon: null },
          { id: 'keys', label: 'keys', value: 'keys', icon: null }, // no content => disabled
        ] as any}
      />
    )

    expect(screen.getByTestId('tabs-value')).toHaveTextContent('two')

    await user.click(screen.getByText('set-disabled'))
    expect(screen.getByTestId('tabs-value')).toHaveTextContent('two') // unchanged

    await user.click(screen.getByText('set-two'))
    expect(screen.getByTestId('tabs-value')).toHaveTextContent('two')
  })

  it('falls back to first content item when active query not selectable', () => {
    mockSearchParams = new URLSearchParams('active=disabled')
    render(
      <ListTab
        listItems={[
          { id: 'one', label: 'one', value: 'one', content: <div>One</div>, icon: null },
          { id: 'keys', label: 'keys', value: 'keys', icon: null },
        ] as any}
      />
    )
    expect(screen.getByTestId('tabs-value')).toHaveTextContent('one')
  })
})

