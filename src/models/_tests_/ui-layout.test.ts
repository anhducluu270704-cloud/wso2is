
import type { EUPageLayoutProps, EUHeaderItemsProps } from '@/models/ui/layout'

describe('models/ui/layout', () => {
  it('EUPageLayoutProps có title, headerImageSrc', () => {
    const props: EUPageLayoutProps = {
      title: 'Title',
      headerImageSrc: '/img.png',
      children: null,
    }
    expect(props.title).toBe('Title')
    expect(props.headerImageSrc).toBe('/img.png')
  })
  it('EUHeaderItemsProps là mảng item có title, url', () => {
    const items: EUHeaderItemsProps = [
      { title: 'Home', url: '/' },
      { title: 'API', url: '/api', subItems: [{ title: 'List', url: '/api/list' }] },
    ]
    expect(items).toHaveLength(2)
    expect(items[0].title).toBe('Home')
    expect(items[1].subItems).toHaveLength(1)
  })
})