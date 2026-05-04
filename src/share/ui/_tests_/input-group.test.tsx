import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupButton,
  InputGroupInput,
  InputGroupTextarea,
} from '@/share/ui/input-group'

jest.mock('@/share/ui/button', () => ({ Button: ({ children, ...p }: any) => <button type="button" {...p}>{children}</button> }))
jest.mock('@/share/ui/input', () => ({ Input: React.forwardRef((p: any, ref: any) => <input ref={ref} {...p} />) }))
jest.mock('@/share/ui/textarea', () => ({ Textarea: (p: any) => <textarea {...p} /> }))
jest.mock('@/share/ui/tooltip', () => ({
  Tooltip: ({ children }: any) => <div>{children}</div>,
  TooltipContent: ({ children }: any) => <span>{children}</span>,
  TooltipProvider: ({ children }: any) => <>{children}</>,
  TooltipTrigger: ({ children }: any) => <span>{children}</span>,
}))

describe('share/ui/input-group', () => {
  it('render InputGroup với addon', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <input placeholder="input" />
      </InputGroup>
    )
    expect(document.querySelector('[data-slot="input-group"]')).toBeInTheDocument()
    expect(screen.getByText('@')).toBeInTheDocument()
  })
  it('render InputGroupAddon các align', () => {
    const { rerender } = render(
      <InputGroup>
        <InputGroupAddon align="inline-end"><InputGroupText>End</InputGroupText></InputGroupAddon>
        <input />
      </InputGroup>
    )
    expect(document.querySelector('[data-align="inline-end"]')).toBeInTheDocument()

    rerender(
      <InputGroup>
        <InputGroupAddon align="block-start"><InputGroupText>Block</InputGroupText></InputGroupAddon>
        <input />
      </InputGroup>
    )
    expect(document.querySelector('[data-align="block-start"]')).toBeInTheDocument()

    rerender(
      <InputGroup>
        <InputGroupAddon align="block-end"><InputGroupText>Block End</InputGroupText></InputGroupAddon>
        <input />
      </InputGroup>
    )
    expect(document.querySelector('[data-align="block-end"]')).toBeInTheDocument()
  })
  it('InputGroupAddon render label với htmlFor', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start" htmlFor="group-input">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <input id="group-input" data-testid="group-input" placeholder="input" />
      </InputGroup>
    )
    const addon = document.querySelector('[data-slot="input-group-addon"]')
    expect(addon?.tagName).toBe('LABEL')
    expect(addon).toHaveAttribute('for', 'group-input')
  })
  it('InputGroupAddon click on button không focus input', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupButton data-testid="addon-btn">Btn</InputGroupButton>
        </InputGroupAddon>
        <input data-testid="group-input" placeholder="input" />
      </InputGroup>
    )
    const button = screen.getByTestId('addon-btn')
    fireEvent.click(button)
    expect(document.activeElement).not.toBe(screen.getByTestId('group-input'))
  })
  it('InputGroupAddon keydown Enter không focus input', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start" htmlFor="group-input">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <input id="group-input" data-testid="group-input" />
      </InputGroup>
    )

    const addon = document.querySelector('[data-slot="input-group-addon"]')
    fireEvent.keyDown(addon!, { key: 'Enter' })

    expect(document.activeElement).not.toBe(screen.getByTestId('group-input'))
  })
  it('InputGroupAddon keydown Space không focus input', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start" htmlFor="group-input">
          <InputGroupText>@</InputGroupText>
        </InputGroupAddon>
        <input id="group-input" data-testid="group-input" />
      </InputGroup>
    )

    const addon = document.querySelector('[data-slot="input-group-addon"]')
    fireEvent.keyDown(addon!, { key: ' ' })

    expect(document.activeElement).not.toBe(screen.getByTestId('group-input'))
  })
  it('InputGroupAddon keydown trên button không focus input', () => {
    render(
      <InputGroup>
        <InputGroupAddon align="inline-start">
          <InputGroupButton data-testid="addon-btn">Btn</InputGroupButton>
        </InputGroupAddon>
        <input data-testid="group-input" />
      </InputGroup>
    )

    const button = screen.getByTestId('addon-btn')
    fireEvent.keyDown(button, { key: 'Enter' })

    expect(document.activeElement).not.toBe(screen.getByTestId('group-input'))
  })
  it('render InputGroupButton không tooltip', () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupButton>Action</InputGroupButton>
        </InputGroupAddon>
        <input />
      </InputGroup>
    )
    expect(screen.getByRole('button', { name: 'Action' })).toBeInTheDocument()
  })
  it('render InputGroupButton với tooltip', () => {
    render(
      <InputGroup>
        <InputGroupAddon>
          <InputGroupButton tooltip="Hint">Btn</InputGroupButton>
        </InputGroupAddon>
        <input />
      </InputGroup>
    )
    expect(screen.getByRole('button', { name: 'Btn' })).toBeInTheDocument()
    expect(screen.getByText('Hint')).toBeInTheDocument()
  })
  it('render InputGroupInput', () => {
    render(
      <InputGroup>
        <InputGroupInput placeholder="Group input" data-testid="group-control" />
      </InputGroup>
    )
    expect(screen.getByPlaceholderText('Group input')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="input-group-control"]')).toBeInTheDocument()
  })
  it('render InputGroupTextarea', () => {
    render(
      <InputGroup>
        <InputGroupTextarea placeholder="Textarea" data-testid="group-textarea" />
      </InputGroup>
    )
    expect(screen.getByPlaceholderText('Textarea')).toBeInTheDocument()
  })
})
