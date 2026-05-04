import UnauthorizedPage from '../unauthorized'

jest.mock('@/share/components/full-page/401', () => ({
  __esModule: true,
  default: function MockUnauthorized401() {
    return null
  },
}))

describe('app/[locale]/(end-user)/unauthorized', () => {
  it('re-exports full-page 401 component', () => {
    expect(typeof UnauthorizedPage).toBe('function')
  })
})
