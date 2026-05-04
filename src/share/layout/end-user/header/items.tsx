import { EUHeaderItemsProps } from '@/models/ui/layout'

export const EUHeaderItems: EUHeaderItemsProps = [
  {
    title: 'apiproducts',
    url: '/api-products',
  },
  {
    title: 'news',
    url: '/news',
  },
  {
    title: 'support',
    url: '/support',
    subItems: [
      { title: 'support_faqs', url: '/support' },
      { title: 'support_guide', url: '/guide' },
    ],
  },
]
