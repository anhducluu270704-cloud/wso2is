
/**
 * models/ui/input - types only, kiểm tra export
 */
import type {
  BaseLayoutInputProps,
  InputFieldProps,
  BaseTextareaProps,
} from '@/models/ui/input'

describe('models/ui/input', () => {
  it('BaseLayoutInputProps có các field cơ bản', () => {
    const props: BaseLayoutInputProps = {
      id: 'id',
      label: 'Label',
      required: true,
      placeholder: 'Placeholder',
      errors: 'Error',
      description: 'Desc',
    }
    expect(props.label).toBe('Label')
    expect(props.required).toBe(true)
  })
  it('BaseTextareaProps extends BaseLayoutInputProps', () => {
    const props: BaseTextareaProps = {
      label: 'T',
      rows: 4,
    }
    expect(props.rows).toBe(4)
  })
})
