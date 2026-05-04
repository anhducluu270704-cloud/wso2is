
import React from 'react'
import { render, screen } from '@testing-library/react'
import { Label } from '@/share/ui/label'

jest.mock('radix-ui', () => ({
  Label: { Root: ({ children, ...p }: { children: React.ReactNode }) => <label {...p}>{children}</label> },
}))

describe('share/ui/label', () => {
  it('render label text', () => {
    render(<Label>Email</Label>)
    expect(screen.getByText('Email')).toBeInTheDocument()
  })
})