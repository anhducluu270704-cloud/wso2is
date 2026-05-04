
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { useForm } from 'react-hook-form'

jest.mock('next-intl', () => ({ useTranslations: () => (key: string, opts?: { label?: string }) => (key === 'input.placeholder' && opts?.label ? `Placeholder ${opts.label}` : '') }))
jest.mock('lucide-react', () => ({
  EyeIcon: () => <span data-testid="eye-icon" />,
  EyeOffIcon: () => <span data-testid="eye-off-icon" />,
}))
let Input: typeof import('@/share/ui/input').Input

function InputWithRegister() {
  const { register } = useForm<{ email: string }>()
  return (
    <Input name="email" register={register} placeholder="Email" />
  )
}

describe('share/ui/input', () => {
  let consoleErrorSpy: jest.SpyInstance

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {})
    Input = jest.requireActual('@/share/ui/input').Input
  })

  afterAll(() => {
    consoleErrorSpy.mockRestore()
  })

  it('render Input', () => {
    render(<Input placeholder="Enter" />)
    expect(screen.getByPlaceholderText('Enter')).toBeInTheDocument()
  })
  it('render Input với size và variant', () => {
    render(<Input placeholder="Test" size="sm" variant="error" />)
    expect(screen.getByPlaceholderText('Test')).toBeInTheDocument()
  })
  it('render Input type password và toggle visibility', () => {
    render(<Input type="password" placeholder="Password" />)
    const input = screen.getByPlaceholderText('Password')
    expect(input).toHaveAttribute('type', 'password')
    const toggle = document.querySelector('.cursor-pointer')
    expect(toggle).toBeInTheDocument()
    fireEvent.click(toggle!)
    expect(input).toHaveAttribute('type', 'text')
    fireEvent.click(toggle!)
    expect(input).toHaveAttribute('type', 'password')
  })
  it('render Input với register', () => {
    render(<InputWithRegister />)
    expect(screen.getByPlaceholderText('Email')).toBeInTheDocument()
    const input = screen.getByPlaceholderText('Email')
    fireEvent.blur(input)
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: 'a@b.com' } })
    expect((input as HTMLInputElement).value).toBe('a@b.com')
  })
  it('render Input disabled', () => {
    render(<Input placeholder="Disabled" disabled />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })
  it('dùng placeholder từ useTranslations khi không truyền placeholder', () => {
    render(<Input label="Search" />)
    const input = document.querySelector('input')
    expect(input).toBeInTheDocument()
    expect(input?.getAttribute('placeholder')).toBe('Placeholder search')
  })

  it('gọi props handlers', () => {
    const onFocus = jest.fn()
    const onBlur = jest.fn()

    render(
      <Input
        placeholder="Handlers"
        onFocus={onFocus}
        onBlur={onBlur}
      />
    )

    const input = screen.getByPlaceholderText('Handlers')

    fireEvent.focus(input)
    fireEvent.blur(input)

    expect(onFocus).toHaveBeenCalledTimes(1)
    expect(onBlur).toHaveBeenCalledTimes(1)
  })

  it('render được khi truyền object ref', () => {
    const ref = React.createRef<HTMLInputElement>()

    render(<Input placeholder="Object ref" ref={ref} />)

    expect(screen.getByPlaceholderText('Object ref')).toBeInTheDocument()
  })

  it('dùng fallback placeholder khi không có label', () => {
    render(<Input />)

    expect(document.querySelector('input')).toHaveAttribute('placeholder', '')
  })

  it('keydown Enter trên toggle password đổi visibility', () => {
    render(<Input type="password" placeholder="kd-test" />)
    const input = screen.getByPlaceholderText('kd-test')
    const toggle = screen.getByRole('button', { name: /show password|hide password/i })
    expect(input).toHaveAttribute('type', 'password')
    fireEvent.keyDown(toggle, { key: 'Enter' })
    expect(input).toHaveAttribute('type', 'text')
    fireEvent.keyDown(toggle, { key: 'Enter' })
    expect(input).toHaveAttribute('type', 'password')
  })

  it('keydown Space trên toggle password đổi visibility', () => {
    render(<Input type="password" placeholder="kd-space" />)
    const input = screen.getByPlaceholderText('kd-space')
    const toggle = screen.getByRole('button', { name: /show password|hide password/i })
    fireEvent.keyDown(toggle, { key: ' ' })
    expect(input).toHaveAttribute('type', 'text')
  })

  it('keydown khác không đổi visibility', () => {
    render(<Input type="password" placeholder="kd-other" />)
    const input = screen.getByPlaceholderText('kd-other')
    const toggle = screen.getByRole('button', { name: /show password|hide password/i })
    fireEvent.keyDown(toggle, { key: 'Tab' })
    expect(input).toHaveAttribute('type', 'password')
  })
})