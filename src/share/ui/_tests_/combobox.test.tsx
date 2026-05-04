
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
  ComboboxValue,
  useComboboxAnchor,
} from '@/share/ui/combobox'

jest.mock('@base-ui/react', () => {
  const React = require('react')

  const renderNode = (render: any, extraProps: Record<string, unknown> = {}) => {
    if (!render) return null
    if (React.isValidElement(render)) return React.cloneElement(render, extraProps)
    const Comp = render
    return <Comp {...extraProps} />
  }

  const withTag = (tag: string) =>
    ({ children, className, ...props }: any) =>
      React.createElement(tag, { className, ...props }, children)

  return {
    Combobox: {
      Root: withTag('div'),
      Value: ({ children, ...props }: any) => <span {...props}>{children || 'value'}</span>,
      Trigger: ({ children, className, ...props }: any) => (
        <button className={className} {...props}>
          {children}
        </button>
      ),
      Clear: ({ children, render, className, ...props }: any) => (
        <div data-testid="primitive-clear-wrapper">
          {renderNode(render, { className, ...props })}
          <span>{children}</span>
        </div>
      ),
      Input: ({ children, render, className, ...props }: any) =>
        render ? (
          <div data-testid="primitive-input-wrapper">
            {renderNode(render, { className, ...props })}
            {children}
          </div>
        ) : (
          <input data-testid="primitive-input" className={className} {...props} />
        ),
      Portal: ({ children }: any) => <div data-testid="combobox-portal">{children}</div>,
      Positioner: (
        { children, className, sideOffset, alignOffset, side, align, anchor, ...props }: any
      ) => (
        <div data-testid="combobox-positioner" className={className} {...props}>
          <span
            data-testid="combobox-positioner-props"
            data-side={side}
            data-align={align}
            data-side-offset={String(sideOffset)}
            data-align-offset={String(alignOffset)}
            data-anchor={String(anchor)}
          />
          {children}
        </div>
      ),
      Popup: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      List: withTag('div'),
      Item: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      ItemIndicator: ({ children, render }: any) => (
        <div data-testid="combobox-item-indicator">
          {renderNode(render)}
          {children}
        </div>
      ),
      Group: withTag('div'),
      GroupLabel: withTag('div'),
      Collection: withTag('div'),
      Empty: withTag('div'),
      Separator: ({ className, ...props }: any) => <hr className={className} {...props} />,
      Chips: withTag('div'),
      Chip: ({ children, className, ...props }: any) => (
        <div className={className} {...props}>
          {children}
        </div>
      ),
      ChipRemove: ({ children, render, className, ...props }: any) => (
        <div data-testid="combobox-chip-remove">
          {renderNode(render, { className, ...props })}
          <span>{children}</span>
        </div>
      ),
    },
  }
})

jest.mock('@/share/ui/button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}))

jest.mock('@/share/ui/input-group', () => ({
  InputGroup: ({ children, className }: any) => <div className={className}>{children}</div>,
  InputGroupAddon: ({ children, align }: any) => <div data-align={align}>{children}</div>,
  InputGroupButton: ({ children, asChild, ...props }: any) =>
    asChild && React.isValidElement(children)
      ? React.cloneElement(children, props)
      : <button {...props}>{children}</button>,
  InputGroupInput: ({ ...props }: any) => <input {...props} />,
}))

jest.mock('lucide-react', () => ({
  CheckIcon: () => <span data-testid="check-icon" />,
  ChevronDownIcon: () => <span data-testid="chevron-down-icon" />,
  XIcon: () => <span data-testid="x-icon" />,
}))

function AnchorProbe() {
  const anchorRef = useComboboxAnchor()
  return <div data-testid="anchor-probe">{String(anchorRef.current)}</div>
}

describe('share/ui/combobox', () => {
  it('render input, trigger, clear và content wrappers', () => {
    render(
      <Combobox>
        <ComboboxInput showClear disabled className="custom-input">
          <span>extra-child</span>
        </ComboboxInput>
        <ComboboxValue />
        <ComboboxContent className="custom-content" anchor="anchor-node">
          <ComboboxList>
            <ComboboxGroup>
              <ComboboxLabel>Group</ComboboxLabel>
              <ComboboxItem value="1">Item 1</ComboboxItem>
            </ComboboxGroup>
            <ComboboxEmpty>No result</ComboboxEmpty>
            <ComboboxSeparator />
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    )

    expect(screen.getByTestId('primitive-input-wrapper')).toBeInTheDocument()
    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
    expect(screen.getByTestId('x-icon')).toBeInTheDocument()
    expect(screen.getByText('extra-child')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="combobox-content"]')).toHaveAttribute(
      'data-chips',
      'true'
    )
    expect(screen.getByText('Group')).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
    expect(screen.getByTestId('combobox-item-indicator')).toBeInTheDocument()
    expect(screen.getByText('No result')).toBeInTheDocument()
  })

  it('render trigger, collection, chips và chip remove branches', () => {
    render(
      <>
        <ComboboxTrigger className="custom-trigger">Open</ComboboxTrigger>
        <ComboboxCollection>Collection</ComboboxCollection>
        <ComboboxChips className="custom-chips">
          <ComboboxChip value="one">Chip one</ComboboxChip>
          <ComboboxChip value="two" showRemove={false}>
            Chip two
          </ComboboxChip>
          <ComboboxChipsInput className="chip-input" />
        </ComboboxChips>
        <AnchorProbe />
      </>
    )

    expect(screen.getByRole('button', { name: 'Open' })).toHaveClass('custom-trigger')
    expect(screen.getByText('Collection')).toBeInTheDocument()
    expect(document.querySelector('[data-slot="combobox-chips"]')).toHaveClass('custom-chips')
    expect(screen.getAllByTestId('combobox-chip-remove')).toHaveLength(1)
    expect(document.querySelector('[data-slot="combobox-chip-input"]')).toHaveClass(
      'chip-input'
    )
    expect(screen.getByTestId('anchor-probe')).toHaveTextContent('null')
  })

  it('ẩn trigger khi showTrigger=false', () => {
    render(<ComboboxInput showTrigger={false} />)

    expect(screen.queryByTestId('chevron-down-icon')).not.toBeInTheDocument()
  })
})
