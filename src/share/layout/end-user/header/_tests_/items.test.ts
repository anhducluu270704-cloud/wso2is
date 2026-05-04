
import { EUHeaderItems } from '../items'

describe('share/layout/end-user/header/items', () => {
  it('EUHeaderItems có title và url', () => {
    expect(EUHeaderItems.length).toBeGreaterThan(0)
    expect(EUHeaderItems[0]).toHaveProperty('title')
    expect(EUHeaderItems[0]).toHaveProperty('url')
  })
})
