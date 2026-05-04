
import { SOCIAL_ICONS, FOOTER_LINKS, HOTLINE } from '@/constants/footer'

jest.mock('@/share/icons', () => ({
  FacebookIcon: () => null,
  LinkedinIcon: () => null,
  YoutubeIcon: () => null,
  ZaloIcon: () => null,
}))

describe('constants/footer', () => {
  it('SOCIAL_ICONS có 4 items', () => {
    expect(SOCIAL_ICONS).toHaveLength(4)
    expect(SOCIAL_ICONS[0]).toHaveProperty('alt')
    expect(SOCIAL_ICONS[0]).toHaveProperty('href')
  })
  it('FOOTER_LINKS có key và href', () => {
    expect(FOOTER_LINKS.length).toBeGreaterThan(0)
    expect(FOOTER_LINKS[0]).toHaveProperty('key')
    expect(FOOTER_LINKS[0]).toHaveProperty('href')
  })
  it('HOTLINE là string', () => {
    expect(typeof HOTLINE).toBe('string')
    expect(HOTLINE).toBe('1800588822')
  })
})