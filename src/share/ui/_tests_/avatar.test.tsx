import React from 'react'
import { render, screen } from '@testing-library/react'

jest.mock('radix-ui', () => {
  const R = require('react')
  const forward = (tag: string) =>
    R.forwardRef((props: Record<string, unknown>, ref: React.Ref<unknown>) => {
      const { children, ...rest } = props as {
        children?: React.ReactNode
        className?: string
      }
      return R.createElement(tag, { ...rest, ref }, children)
    })

  return {
    Avatar: {
      Root: forward('div'),
      Image: forward('img'),
      Fallback: forward('span'),
    },
  }
})

import {
  Avatar,
  AvatarImage,
  AvatarFallback,
  AvatarBadge,
  AvatarGroup,
  AvatarGroupCount,
} from '../avatar'

describe('share/ui/avatar', () => {
  it('render Avatar', () => {
    render(
      <Avatar>
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>
    )
    expect(document.querySelector('[data-slot="avatar"]')).toBeInTheDocument()
    expect(screen.getByText('AB')).toBeInTheDocument()
  })

  it('render Avatar với size sm, lg', () => {
    const { rerender } = render(
      <Avatar size="sm">
        <AvatarFallback>X</AvatarFallback>
      </Avatar>
    )
    expect(document.querySelector('[data-size="sm"]')).toBeInTheDocument()
    rerender(
      <Avatar size="lg">
        <AvatarFallback>X</AvatarFallback>
      </Avatar>
    )
    expect(document.querySelector('[data-size="lg"]')).toBeInTheDocument()
  })

  it('render AvatarImage', () => {
    render(
      <Avatar>
        <AvatarImage src="/img.png" alt="" />
        <AvatarFallback>F</AvatarFallback>
      </Avatar>
    )
    expect(document.querySelector('[data-slot="avatar-image"]')).toHaveAttribute(
      'src',
      '/img.png'
    )
  })

  it('render AvatarFallback', () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>
    )
    expect(document.querySelector('[data-slot="avatar-fallback"]')).toHaveTextContent(
      'JD'
    )
  })

  it('render AvatarBadge', () => {
    render(
      <Avatar>
        <AvatarFallback>U</AvatarFallback>
        <AvatarBadge>+1</AvatarBadge>
      </Avatar>
    )
    expect(document.querySelector('[data-slot="avatar-badge"]')).toHaveTextContent(
      '+1'
    )
  })

  it('render AvatarGroup và AvatarGroupCount', () => {
    render(
      <AvatarGroup>
        <Avatar>
          <AvatarFallback>A</AvatarFallback>
        </Avatar>
        <AvatarGroupCount>+2</AvatarGroupCount>
      </AvatarGroup>
    )
    expect(document.querySelector('[data-slot="avatar-group"]')).toBeInTheDocument()
    expect(
      document.querySelector('[data-slot="avatar-group-count"]')
    ).toHaveTextContent('+2')
  })
})
