
import { render } from '@testing-library/react'
import { Toaster } from '../sonner'

jest.mock('next-themes', () => ({
  useTheme: jest.fn(),
}))

jest.mock('sonner', () => ({
  Toaster: jest.fn(() => {
    return <div data-testid="sonner-toaster" />
  }),
}))

describe('Toaster', () => {
  const { useTheme } = require('next-themes')
  const { Toaster: Sonner } = require('sonner')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders toaster', () => {
    useTheme.mockReturnValue({ theme: 'dark' })

    const { getByTestId } = render(<Toaster />)

    expect(getByTestId('sonner-toaster')).toBeInTheDocument()
  })

  it('passes theme from useTheme', () => {
    useTheme.mockReturnValue({ theme: 'dark' })

    render(<Toaster />)

    expect(Sonner).toHaveBeenCalled()

    const props = Sonner.mock.calls[0][0]
    expect(props.theme).toBe('dark')
  })

  it('uses default system theme when undefined', () => {
    useTheme.mockReturnValue({})

    render(<Toaster />)

    const props = Sonner.mock.calls[0][0]

    expect(props.theme).toBe('system')
  })

  it('passes correct position and offset', () => {
    useTheme.mockReturnValue({ theme: 'light' })

    render(<Toaster />)

    const props = Sonner.mock.calls[0][0]

    expect(props.position).toBe('top-right')
    expect(props.offset).toEqual({ top: '74px' })
  })

  it('passes icons configuration', () => {
    useTheme.mockReturnValue({ theme: 'light' })

    render(<Toaster />)

    const props = Sonner.mock.calls[0][0]

    expect(props.icons).toBeDefined()
    expect(props.icons.success).toBeTruthy()
    expect(props.icons.error).toBeTruthy()
  })

  it('allows overriding props', () => {
    useTheme.mockReturnValue({ theme: 'light' })

    render(<Toaster position="bottom-left" />)

    const props = Sonner.mock.calls[0][0]

    expect(props.position).toBe('bottom-left')
  })
})
