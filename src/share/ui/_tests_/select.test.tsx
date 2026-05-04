
import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectValue,
  SelectScrollDownButton,
  SelectScrollUpButton,
} from '../select'

describe('Select UI', () => {
  function renderSelect() {
    return render(
      <Select defaultValue="1">
        <SelectTrigger data-testid="trigger">
          <SelectValue placeholder="Select item" />
        </SelectTrigger>

        <SelectContent>
          <SelectGroup>
            <SelectLabel>Group</SelectLabel>

            <SelectItem value="1">Item 1</SelectItem>
            <SelectItem value="2">Item 2</SelectItem>

            <SelectSeparator />
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  function renderPopperSelect() {
    return render(
      <Select defaultValue="1">
        <SelectTrigger data-testid="popper-trigger" size="sm">
          <SelectValue placeholder="Select item" />
        </SelectTrigger>

        <SelectContent position="popper" align="start">
          <SelectGroup>
            <SelectItem value="1">Item 1</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    )
  }

  it('renders trigger', () => {
    renderSelect()

    expect(screen.getByTestId('trigger')).toBeInTheDocument()
  })

  it('opens select content', () => {
    renderSelect()

    fireEvent.click(screen.getByTestId('trigger'))

    expect(screen.getByRole('listbox')).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Item 1' })).toBeInTheDocument()
  })

  it('renders group label', () => {
    renderSelect()

    fireEvent.click(screen.getByTestId('trigger'))

    expect(screen.getByText('Group')).toBeInTheDocument()
  })

  it('renders items', () => {
    renderSelect()

    fireEvent.click(screen.getByTestId('trigger'))

    expect(screen.getByRole('option', { name: 'Item 1' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Item 2' })).toBeInTheDocument()
  })

  it('select item works', () => {
    renderSelect()

    fireEvent.click(screen.getByTestId('trigger'))
    fireEvent.click(screen.getByText('Item 2'))

    expect(screen.getByTestId('trigger')).toBeInTheDocument()
  })

  it('renders popper content with viewport attributes', () => {
    renderPopperSelect()

    fireEvent.click(screen.getByTestId('popper-trigger'))

    expect(screen.getByRole('listbox')).toHaveAttribute(
      'data-align-trigger',
      'false'
    )
    expect(document.querySelector('[data-position="popper"]')).toBeInTheDocument()
  })
})

describe('Scroll buttons', () => {
  it('renders scroll up button', () => {
    expect(SelectScrollUpButton).toBeDefined()
  })

  it('renders scroll down button', () => {
    expect(SelectScrollDownButton).toBeDefined()
  })
})
