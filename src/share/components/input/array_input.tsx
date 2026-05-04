'use client'

import { ArrayInputProps } from '@/models/ui/input'
import { inputVariants } from '@/share/ui/input'
import { useTranslations } from 'next-intl'
import { ArrayPath, FieldValues, Path, useFieldArray } from 'react-hook-form'
import { useRef, useState, type ChangeEvent } from 'react'
import { Field } from '@/share/ui/field'
import { DeleteIcon, AddIcon as AddIconFromIcons } from '@/share/icons'
import AddIconSvg from '@/share/icons/add.svg'
import { Button } from '@/share/ui/button'

const AddIcon = AddIconFromIcons ?? AddIconSvg

function ArrayInput<T extends FieldValues>({
  variant = 'default',
  name,
  placeholder,
  className = '',
  disabled = false,
  addButtonText,
  itemPlaceholder,
  control,
  register,
  onArrayChange,
  error,
  canAdd,
  readonlyAfterFirst = false,
  hideDeleteForFirst = false,
  addPlacement = 'end',
  addAtStart = false,
  defaultValues,
  ...props
}: Readonly<ArrayInputProps<T>>) {
  const t = useTranslations('form')

  const inputClassName = inputVariants({
    variant,
    disabled,
    className,
    ...props,
  })

  const { fields, append, remove, prepend } = useFieldArray({
    control,
    name: name as ArrayPath<T>,
    shouldUnregister: false,
  })

  const valuesRef = useRef<string[]>(defaultValues ?? [])
  const [values, setValues] = useState<string[]>(defaultValues ?? [])

  const emitArrayChange = (nextValues: string[]) => {
    onArrayChange?.(nextValues)
  }

  const addItem = () => {
    const currentValues = valuesRef.current
    const nextValues = [...currentValues]
    const can = canAdd ? canAdd(nextValues) : true
    if (!can) return

    if (addAtStart) {
      const next = ['', ...currentValues]
      valuesRef.current = next
      setValues(next)
      emitArrayChange(next)
      prepend('' as never)
      return
    }

    const next = [...currentValues, '']
    valuesRef.current = next
    setValues(next)
    emitArrayChange(next)
    append('' as never)
  }

  const removeItem = (index: number) => {
    const prev = valuesRef.current
    const next = prev.filter((_, i) => i !== index)
    valuesRef.current = next
    setValues(next)
    emitArrayChange(next)
    if (index < fields.length) remove(index)
  }

  const registerWithMirror = (fieldIndex: number) => {
    const reg = register(`${name}.${fieldIndex}` as Path<T>)
    const originalOnChange = reg.onChange as unknown as
      | ((event: ChangeEvent<HTMLInputElement>) => void)
      | undefined

    return {
      ...reg,
      onChange: (e: ChangeEvent<HTMLInputElement>) => {
        originalOnChange?.(e)
        const raw = e.target.value
        const prev = valuesRef.current
        const next = [...prev]
        next[fieldIndex] = raw
        valuesRef.current = next
        setValues(next)
        emitArrayChange(next)
      },
    }
  }

  const AddButton = (
    <Button
      type="button"
      onClick={addItem}
      disabled={disabled}
      variant="ghost"
      size="select"
      className="bg-grey-12 rounded-full"
    >
      <AddIcon className="size-6 text-black-1" />
      {addButtonText ? (
        <span>{addButtonText}</span>
      ) : null}
    </Button>
  )

  const shouldRenderAddButtonStart = addPlacement === 'start'
  const shouldRenderAddButtonEnd = addPlacement === 'end'

  const effectiveLength = Math.max(fields.length, values.length)
  const renderedFields =
    fields.length > 0 && fields.length === effectiveLength
      ? fields
      : Array.from({ length: effectiveLength }, (_, index) => ({
          id: `local-${index}`,
        })) as typeof fields

  return (
    <Field>
      <div className="flex flex-col gap-2">
        {effectiveLength === 0 ? (
          <>
            <div className="text-gray-500 text-sm italic py-2">
              {t('input.no_items', {
                label: props.label?.toLowerCase() ?? 'items',
              }) ?? 'No items added yet'}
            </div>
            {shouldRenderAddButtonStart && AddButton}
          </>
        ) : (
          renderedFields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-4">
              <div className="flex-1 relative">
                {readonlyAfterFirst && index > 0 ? (
                  <div className="min-h-11 flex items-center rounded-lg bg-grey-3 px-4 text-body-body text-black-1">
                    {values[index] ?? ''}
                  </div>
                ) : (
                  <input
                    type="text"
                    key={field.id}
                    {...registerWithMirror(index)}
                    placeholder={
                      itemPlaceholder ??
                      placeholder ??
                      t('input.placeholder', {
                        label: `${props.label?.toLowerCase() ?? 'item'} ${
                          index + 1
                        }`,
                      })
                    }
                    disabled={disabled}
                    className={inputClassName}
                  />
                )}
              </div>

              {index === 0 && shouldRenderAddButtonStart && AddButton}

              {!(readonlyAfterFirst && hideDeleteForFirst && index === 0) && (
                <Button
                  type="button"
                  onClick={() => removeItem(index)}
                  disabled={disabled}
                  variant="ghost"
                  size="select"
                  className="bg-grey-12 rounded-full"
                >
                  <DeleteIcon className="size-6 text-black-1" />
                </Button>
              )}
            </div>
          ))
        )}

        {shouldRenderAddButtonEnd && AddButton}
        {error ? <p className="text-xs text-red-1">{error}</p> : null}
      </div>
    </Field>
  )
}

export default ArrayInput
