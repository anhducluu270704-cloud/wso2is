
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ArrayInput from '../array_input'

jest.mock('next-intl', () => ({
  useTranslations: () => (_k: string, vars?: any) =>
    vars?.label ? `no_items:${vars.label}` : 't',
}))

jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: any) => <div>{children}</div>,
}))

jest.mock('@/share/ui/input', () => ({
  inputVariants: () => 'input-class',
}))

jest.mock('@/share/icons', () => ({
  AddIcon: () => <span>AddIcon</span>,
  DeleteIcon: () => <span>DeleteIcon</span>,
}))

const append = jest.fn()
const remove = jest.fn()
let fields: any[] = []

jest.mock('react-hook-form', () => ({
  useFieldArray: () => ({ fields, append, remove }),
}))

describe('share/components/input/array_input', () => {
  beforeEach(() => {
    append.mockClear()
    remove.mockClear()
    fields = []
  })

  it('shows empty state when no items', () => {
    render(
      <ArrayInput
        id="x"
        name={'items' as any}
        label="IPs"
        control={{} as any}
        register={jest.fn() as any}
      />
    )

    expect(screen.getAllByText('no_items:ips').length).toBeGreaterThan(0)
    expect(screen.getByText('AddIcon')).toBeInTheDocument()
  })

  it('renders inputs for items and can remove/add', async () => {
    const user = userEvent.setup()
    fields = [{ id: 'a' }, { id: 'b' }]
    const register = jest.fn(() => ({}))

    render(
      <ArrayInput
        id="x"
        name={'items' as any}
        label="Item"
        placeholder="P"
        control={{} as any}
        register={register as any}
      />
    )

    expect(screen.getAllByRole('textbox')).toHaveLength(2)
    await user.click(screen.getAllByRole('button')[0])
    expect(remove).toHaveBeenCalledWith(0)

    await user.click(screen.getByText(/AddIcon/).closest('button')!)
    expect(append).toHaveBeenCalled()
  })
})

