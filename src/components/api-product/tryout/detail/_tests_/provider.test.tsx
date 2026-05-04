import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import {
  TryoutDetailProvider,
  useTryoutDetailContext,
} from '../provider'

function Consumer() {
  const ctx = useTryoutDetailContext()
  return (
    <div>
      <span data-testid="scheme">{ctx.securitySchemeType}</span>
      <button
        type="button"
        onClick={() => ctx.setSecuritySchemeType('API_KEY')}
      >
        set-api-key
      </button>
    </div>
  )
}

describe('TryoutDetailProvider', () => {
  it('cung cấp giá trị mặc định và cập nhật qua setter', async () => {
    render(
      <TryoutDetailProvider>
        <Consumer />
      </TryoutDetailProvider>,
    )
    expect(screen.getByTestId('scheme')).toHaveTextContent('OAUTH')
    await userEvent.click(screen.getByRole('button', { name: 'set-api-key' }))
    expect(screen.getByTestId('scheme')).toHaveTextContent('API_KEY')
  })

  it('useTryoutDetailContext ném lỗi ngoài provider', () => {
    const Err = () => {
      useTryoutDetailContext()
      return null
    }
    expect(() => render(<Err />)).toThrow(
      'useTryoutDetailContext must be used within TryoutDetailProvider',
    )
  })
})
