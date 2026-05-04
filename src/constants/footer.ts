import {
  FacebookIcon,
  LinkedinIcon,
  YoutubeIcon,
  ZaloIcon,
} from '@/share/icons'

export const SOCIAL_ICONS = [
  { Icon: FacebookIcon, alt: 'Facebook', href: 'https://www.facebook.com/Techcombank' },
  { Icon: LinkedinIcon, alt: 'LinkedIn', href: 'https://www.linkedin.com/company/techcombank/about/' },
  { Icon: YoutubeIcon, alt: 'YouTube', href: 'https://www.youtube.com/@TechcombankVietnam' },
  { Icon: ZaloIcon, alt: 'Zalo', href: 'https://zalo.me/990032437451686927' },
] as const

export const FOOTER_LINKS = [
  {
    key: 'footer.termsconditions' as const,
    href: 'https://techcombank.com/content/dam/techcombank/public-site/imported-assets/MB-01-HD-SPDN-20-Ban-Dieu-Khoan-va-Dieu-kien-chung-ve-san-pham-va-dich-vu-04e180a79d.pdf',
  },
  {
    key: 'footer.privacypolicy' as const,
    href: 'https://techcombank.com/en/help-support/privacy-policy',
  },
] as const

export const HOTLINE = '1800588822'
