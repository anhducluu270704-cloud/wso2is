
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import SearchInput from '../search'

jest.mock('next-intl', () => ({ useTranslations: () => () => 'Search...' }))
jest.mock('@/share/ui/input', () => ({ inputVariants: () => '', Input: (p: any) => <input {...p} /> }))
jest.mock('@/share/ui/input-group', () => ({
  InputGroup: ({ children, className }: any) => <div className={className}>{children}</div>,
  InputGroupAddon: ({ children }: any) => <div>{children}</div>,
  InputGroupText: ({ children }: any) => <span>{children}</span>,
}))
jest.mock('lucide-react', () => ({ SearchIcon: () => null, X: () => null }))

describe('share/components/input/search', () => {
  it('render SearchInput', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(document.querySelector('input')).toBeInTheDocument()
  })

  it('render với size xl có class h-16', () => {
    const { container } = render(<SearchInput value="" onChange={() => {}} size="xl" />)
    expect(container.querySelector('.h-16')).toBeInTheDocument()
  })

  it('onChange được gọi khi nhập', () => {
    const onChange = jest.fn()
    render(<SearchInput value="" onChange={onChange} />)
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'a' } })
    expect(onChange).toHaveBeenCalledWith('a')
    fireEvent.change(screen.getByPlaceholderText('Search...'), { target: { value: 'ab' } })
    expect(onChange).toHaveBeenCalledTimes(2)
    expect(onChange).toHaveBeenLastCalledWith('ab')
  })

  it('click nút clear gọi onChange("")', () => {
    const onChange = jest.fn()
    render(<SearchInput value="test" onChange={onChange} />)
    const clearBtn = document.querySelector('button')
    expect(clearBtn).toBeInTheDocument()
    fireEvent.click(clearBtn!)
    expect(onChange).toHaveBeenCalledWith('')
  })

  it('render với placeholder tùy chỉnh', () => {
    render(<SearchInput value="" onChange={() => {}} placeholder="Tìm kiếm..." />)
    expect(screen.getByPlaceholderText('Tìm kiếm...')).toBeInTheDocument()
  })

  it('không hiện nút clear khi text rỗng', () => {
    render(<SearchInput value="" onChange={() => {}} />)
    expect(document.querySelector('button')).not.toBeInTheDocument()
  })

  it('value thay đổi bên ngoài thì cập nhật input', () => {
    const { rerender } = render(<SearchInput value="abc" onChange={() => {}} />)
    rerender(<SearchInput value="xyz" onChange={() => {}} />)
    const input = document.querySelector('input') as HTMLInputElement
    expect(input.value).toBe('xyz')
  })

  it('composition: change vẫn gọi onChange; compositionEnd không tự tạo thêm onChange', () => {
    const onChange = jest.fn()
    render(<SearchInput value="" onChange={onChange} />)
    const input = screen.getByPlaceholderText('Search...')

    fireEvent.compositionStart(input)
    fireEvent.change(input, { target: { value: 'đức' } })
    expect(onChange).toHaveBeenCalledTimes(1)
    expect(onChange).toHaveBeenCalledWith('đức')

    fireEvent.compositionEnd(input)
    expect(onChange).toHaveBeenCalledTimes(1)
  })
})