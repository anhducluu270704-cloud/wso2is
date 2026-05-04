
import React from 'react'
import { render, screen } from '@testing-library/react'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/share/ui/dropdown-menu'

jest.mock('radix-ui', () => ({
  DropdownMenu: {
    Root: ({ children, ...props }: any) => <div data-testid="dropdown-root" {...props}>{children}</div>,
    Portal: ({ children, ...props }: any) => <div data-testid="dropdown-portal" {...props}>{children}</div>,
    Trigger: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    Content: ({ children, align, sideOffset, className, ...props }: any) => (
      <div
        data-testid="dropdown-content"
        data-align={align}
        data-side-offset={String(sideOffset)}
        className={className}
        {...props}
      >
        {children}
      </div>
    ),
    Group: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    Item: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
    CheckboxItem: ({ children, className, checked, ...props }: any) => (
      <button data-checked={String(checked)} className={className} {...props}>
        {children}
      </button>
    ),
    RadioGroup: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    RadioItem: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
    Label: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
    Separator: ({ className, ...props }: any) => <hr className={className} {...props} />,
    ItemIndicator: ({ children }: any) => <span data-testid="item-indicator">{children}</span>,
    Sub: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    SubTrigger: ({ children, className, ...props }: any) => <button className={className} {...props}>{children}</button>,
    SubContent: ({ children, className, ...props }: any) => <div className={className} {...props}>{children}</div>,
  },
}))

jest.mock('lucide-react', () => ({
  CheckIcon: () => <span data-testid="check-icon" />,
  ChevronRightIcon: () => <span data-testid="chevron-right-icon" />,
}))

describe('share/ui/dropdown-menu', () => {
  it('render đầy đủ dropdown menu wrappers', () => {
    render(
      <DropdownMenu>
        <DropdownMenuTrigger>Open menu</DropdownMenuTrigger>
        <DropdownMenuPortal>
          <DropdownMenuContent className="custom-content">
            <DropdownMenuGroup>
              <DropdownMenuLabel inset>Options</DropdownMenuLabel>
              <DropdownMenuItem>Default item</DropdownMenuItem>
              <DropdownMenuItem inset variant="selected">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" disabled>
                Delete
              </DropdownMenuItem>
              <DropdownMenuCheckboxItem checked>
                Checked item
              </DropdownMenuCheckboxItem>
              <DropdownMenuRadioGroup>
                <DropdownMenuRadioItem value="a">Radio item</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
              <DropdownMenuSeparator />
              <DropdownMenuShortcut>cmd+k</DropdownMenuShortcut>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenuPortal>
      </DropdownMenu>
    )

    expect(screen.getByTestId('dropdown-root')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Open menu' })).toBeInTheDocument()
    expect(screen.getByTestId('dropdown-content')).toHaveAttribute('data-align', 'start')
    expect(screen.getByTestId('dropdown-content')).toHaveAttribute('data-side-offset', '4')
    expect(screen.getByText('Default item')).toHaveAttribute('data-variant', 'default')
    expect(screen.getByText('Profile')).toHaveAttribute('data-inset', 'true')
    expect(screen.getByText('Profile')).toHaveAttribute('data-variant', 'selected')
    expect(screen.getByText('Delete')).toBeDisabled()
    expect(screen.getByText('Checked item')).toHaveAttribute('data-checked', 'true')
    expect(screen.getAllByTestId('item-indicator').length).toBeGreaterThan(0)
    expect(screen.getByText('cmd+k')).toBeInTheDocument()
  })

  it('render sub menu với custom props', () => {
    render(
      <DropdownMenuSub>
        <DropdownMenuSubTrigger inset>More</DropdownMenuSubTrigger>
        <DropdownMenuSubContent className="custom-sub-content">
          Sub content
        </DropdownMenuSubContent>
      </DropdownMenuSub>
    )

    expect(screen.getByRole('button', { name: 'More' })).toHaveAttribute(
      'data-inset',
      'true'
    )
    expect(screen.getByTestId('chevron-right-icon')).toBeInTheDocument()
    expect(screen.getByText('Sub content')).toHaveClass('custom-sub-content')
  })
})
