
jest.mock('next/navigation', () => ({
  notFound: jest.fn(),
}))

describe('CatchAllPage', () => {
  it('calls notFound immediately', async () => {
    const { default: CatchAllPage } = await import('../page')
    const { notFound } = await import('next/navigation')

    CatchAllPage()

    expect(notFound).toHaveBeenCalled()
  })
})

