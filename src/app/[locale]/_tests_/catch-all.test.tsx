
import React from 'react'
import { render } from '@testing-library/react'

const mockNotFound = jest.fn()

jest.mock('next/navigation', () => ({
  notFound: () => mockNotFound(),
}))

describe('locale catch-all page', () => {
  it('calls notFound', async () => {
    const { default: CatchAllPage } = await import('../[...rest]/page')

    render(<>{CatchAllPage()}</>)

    expect(mockNotFound).toHaveBeenCalled()
  })
})
