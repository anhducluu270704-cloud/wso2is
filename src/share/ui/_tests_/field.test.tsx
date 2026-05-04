
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/share/ui/field'

describe('share/ui/field', () => {
  it('render các primitive cơ bản', () => {
    render(
      <FieldSet>
        <FieldLegend>Legend</FieldLegend>
        <FieldGroup>
          <Field orientation="horizontal">
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <FieldContent>
              <input id="name" />
              <FieldDescription>Description</FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </FieldSet>
    )

    expect(document.querySelector('[data-slot="field-set"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="field-group"]')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="field"]')).toHaveAttribute(
      'data-orientation',
      'horizontal'
    )
    expect(screen.getByText('Legend')).toBeInTheDocument()
    expect(screen.getByText('Name')).toBeInTheDocument()
    expect(screen.getByText('Description')).toBeInTheDocument()
  })

  it('render legend variant label, title và separator có nội dung', () => {
    render(
      <>
        <FieldLegend variant="label">Label legend</FieldLegend>
        <FieldTitle>Field title</FieldTitle>
        <FieldSeparator>Or continue</FieldSeparator>
      </>
    )

    expect(screen.getByText('Label legend')).toHaveAttribute('data-variant', 'label')
    expect(screen.getByText('Field title')).toBeInTheDocument()
    expect(screen.getByText('Or continue')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="field-separator"]')
    ).toHaveAttribute('data-content', 'true')
  })

  it('render separator không có children', () => {
    render(<FieldSeparator />)

    expect(
      document.querySelector('[data-slot="field-separator"]')
    ).toHaveAttribute('data-content', 'false')
    expect(
      document.querySelector('[data-slot="field-separator-content"]')
    ).not.toBeInTheDocument()
  })

  it('FieldError ưu tiên children truyền vào', () => {
    render(
      <FieldError errors={[{ message: 'Error 1' }]}>
        Custom error
      </FieldError>
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Custom error')
  })

  it('FieldError trả về null khi không có content', () => {
    const { container } = render(<FieldError errors={[]} />)

    expect(container).toBeEmptyDOMElement()
  })

  it('FieldError render một lỗi duy nhất sau khi loại trùng', () => {
    render(
      <FieldError
        errors={[{ message: 'Duplicated' }, { message: 'Duplicated' }]}
      />
    )

    expect(screen.getByRole('alert')).toHaveTextContent('Duplicated')
  })

  it('FieldError render danh sách lỗi duy nhất', () => {
    render(
      <FieldError
        errors={[
          { message: 'Error 1' },
          { message: 'Error 2' },
          { message: 'Error 1' },
          undefined,
        ]}
      />
    )

    expect(screen.getByRole('list')).toBeInTheDocument()
    expect(screen.getAllByRole('listitem')).toHaveLength(2)
  })
})
