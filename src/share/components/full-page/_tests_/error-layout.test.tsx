import { render, screen } from '@testing-library/react'
import ErrorPageLayout from '../error-layout'

jest.mock('@/share/icons', () => ({
  Overlay: () => <div data-testid="overlay" />,
}))

describe('components/full-page/error-layout', () => {
  it('renders Overlay and children', () => {
    render(
      <ErrorPageLayout>
        <div>Child</div>
      </ErrorPageLayout>
    )

    expect(screen.getByTestId('overlay')).toBeInTheDocument()
    expect(screen.getByText('Child')).toBeInTheDocument()
  })
})

