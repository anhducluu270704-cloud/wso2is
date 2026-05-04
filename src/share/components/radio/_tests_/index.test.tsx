
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'

import RadioGroupField from '../index'

jest.mock('@/share/ui/field', () => ({
  Field: ({ children }: any) => <div>{children}</div>,
  FieldContent: ({ children }: any) => <div>{children}</div>,
  FieldDescription: ({ children }: any) => <p data-testid="desc">{children}</p>,
  FieldError: ({ children }: any) => (
    <span data-testid="field-error">{children}</span>
  ),
  FieldLabel: ({ children }: any) => <label>{children}</label>,
}))

jest.mock('@/share/ui/radio-group', () => {
  const R = require('react')
  const RadioGroup = ({ children, value, onValueChange, className }: any) => (
    <div role="radiogroup" className={className} data-current={value}>
      {R.Children.map(children, (row: any) => {
        if (!R.isValidElement(row)) return row
        const cells = R.Children.toArray(row.props.children)
        const item = cells.find(
          (c: any) =>
            R.isValidElement(c) && typeof c.props.value === 'string',
        ) as R.ReactElement<{ value: string }> | undefined
        if (!item) return row
        const v = item.props.value
        const labelEl = cells.find((c) => c !== item)
        return (
          <div key={v} className={row.props.className}>
            <button
              type="button"
              role="radio"
              aria-checked={value === v}
              data-testid={`radio-${v}`}
              onClick={() => onValueChange(v)}
            />
            {labelEl}
          </div>
        )
      })}
    </div>
  )
  const RadioGroupItem = ({ value }: { value: string }) => (
    <span data-slot="item-stub" data-value={value} />
  )
  return { RadioGroup, RadioGroupItem }
})

type FormValues = { plan: string }

function WatchForm(props: {
  label?: React.ReactNode
  required?: boolean
  description?: React.ReactNode
  showError?: boolean
}) {
  const { control, watch, setError } = useForm<FormValues>({
    defaultValues: { plan: 'basic' },
  })

  React.useEffect(() => {
    if (props.showError) {
      setError('plan', { message: 'Invalid choice' })
    }
  }, [props.showError, setError])

  return (
    <>
      <RadioGroupField
        name="plan"
        control={control}
        label={props.label}
        required={props.required}
        description={props.description}
        options={[
          { value: 'basic', label: 'Basic' },
          { value: 'pro', label: 'Pro' },
        ]}
      />
      <div data-testid="watched">{watch('plan')}</div>
    </>
  )
}

describe('share/components/radio', () => {
  it('renders label, required marker, options, description', () => {
    render(
      <WatchForm
        label="Pick plan"
        required
        description="Monthly billing"
      />,
    )

    expect(screen.getByText('Pick plan')).toBeInTheDocument()
    expect(screen.getByText('*')).toBeInTheDocument()
    expect(screen.getByText('Basic')).toBeInTheDocument()
    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByTestId('desc')).toHaveTextContent('Monthly billing')
  })

  it('updates form value when another option is selected', async () => {
    render(<WatchForm />)

    expect(screen.getByTestId('watched')).toHaveTextContent('basic')

    await userEvent.click(screen.getByTestId('radio-pro'))

    expect(screen.getByTestId('watched')).toHaveTextContent('pro')
  })

  it('shows validation message from fieldState', () => {
    render(<WatchForm showError />)

    expect(screen.getByTestId('field-error')).toHaveTextContent(
      'Invalid choice',
    )
  })
})
