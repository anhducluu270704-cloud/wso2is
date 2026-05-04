
/**
 * Unit test: components/full-page/loading
 */
import { render, screen } from '@testing-library/react'
import LoadingPage from '../loading'

jest.mock('@/share/ui/spinner', () => ({
  SpinnerCustom: () => <div data-testid="spinner">Spinner</div>,
}))

describe('components/full-page/loading', () => {
  it('render spinner', () => {
    render(<LoadingPage />)
    expect(screen.getByTestId('spinner')).toBeInTheDocument()
  })
})