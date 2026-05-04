'use client'

import { useTranslations } from 'next-intl'
import { FOOTER_LINKS, HOTLINE, SOCIAL_ICONS } from '@/constants/footer'
import { LOGO_REDIRECT_WHITE } from '@/constants/system'
import LocalesDropdown from '@/share/components/language-switch.tsx'
import Image from 'next/image'
import Link from 'next/link'

export default function EUFooter() {
  const t = useTranslations('layout')
  return (
    <footer className="bg-black-2">
      <div className="container mx-auto w-full flex flex-col gap-10 py-12">
        <div className="flex flex-col gap-6 pb-10 md:flex-row md:items-start md:justify-between">
          <div className="flex flex-col gap-[10px]">
            <Image
              src={LOGO_REDIRECT_WHITE}
              alt="Techcombank"
              height={58}
              width={216}
            />

            {FOOTER_LINKS.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-body-body text-white hover:underline"
              >
                {t(`${item.key}`)}
              </Link>
            ))}
          </div>
          <div className="flex flex-col gap-6 items-start md:items-end">
            <div className="flex items-center gap-2 !text-body-emphasize text-grey-10 [&_button]:border-0 [&_button]:bg-transparent [&_button]:text-white [&_button]:hover:bg-transparent [&_button]:focus:bg-transparent [&_button]:focus-visible:bg-transparent [&_button]:focus:ring-0 [&_button]:focus-visible:ring-0 [&_button]:outline-none [&_button]:h-auto [&_button]:min-h-0 [&_button]:p-0 [&_button_span]:text-body-emphasize [&_button_svg]:!text-white [&_button_svg]:!stroke-white [&_button[aria-expanded=true]]:!bg-transparent [&_button[aria-expanded=true]]:!text-white [&_button_span]:text-grey-10">
              <span className="text-body-emphasize text-grey-10">
                {t('footer.language')}
              </span>
              <LocalesDropdown showLabel alignDropdown="end" />
            </div>
            <div className="flex flex-col gap-4 items-start md:items-end">
              <p className="text-body-body text-black-3">
                {t('footer.stayconnected')}
              </p>
              <div className="flex items-center gap-6">
                {SOCIAL_ICONS.map(({ Icon, alt, href }) => (
                  <a
                    key={alt}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex size-8 items-center justify-center text-black-3 transition-opacity hover:opacity-80 focus:outline-none focus:ring-0"
                    aria-label={alt}
                  >
                    <Icon className="size-8 shrink-0 [&_path]:fill-current" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-8 text-body-helptext leading-[21px] text-black-3">
            <Link
              href="https://techcombank.com/en/help-support/privacy-policy"
              className="hover:opacity-90"
            >
              {t('footer.copyright')}
            </Link>
          </div>
          <div className="flex items-center gap-2 text-body-helptext">
            <span
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-black-3 text-black-2"
              aria-hidden
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z"
                  fill="#A2A2A2"
                />
                <path
                  d="M16.1089 13.1526C15.9952 13.0211 15.8546 12.9157 15.6965 12.8435C15.5385 12.7712 15.3667 12.7338 15.193 12.7338C15.0192 12.7338 14.8475 12.7712 14.6894 12.8435C14.5314 12.9157 14.3907 13.0211 14.277 13.1526L13.4201 14.0392H13.2133H12.9473C12.1082 13.5003 11.3685 12.8203 10.7608 12.0294C10.4596 11.6833 10.2108 11.295 10.0221 10.8767L10.6426 10.2856L10.879 10.0492C11.011 9.93268 11.1168 9.78942 11.1892 9.6289C11.2617 9.46838 11.2992 9.29428 11.2992 9.11816C11.2992 8.94204 11.2617 8.76794 11.1892 8.60742C11.1168 8.4469 11.011 8.30364 10.879 8.18715L10.1403 7.44825L9.81528 6.91624L9.31296 6.41378C9.20208 6.28697 9.06598 6.18467 8.91336 6.11342C8.76073 6.04217 8.59492 6.00354 8.42653 6C8.25404 6.00472 8.08421 6.04373 7.92695 6.11477C7.76969 6.18582 7.62814 6.28746 7.51055 6.41378L6.59457 7.33002C6.25988 7.66291 6.05102 8.10164 6.00362 8.57137C5.97696 9.25895 6.09787 9.94426 6.35819 10.5812C7.56079 13.5544 9.85484 15.9548 12.77 17.2904C13.506 17.6743 14.3082 17.915 15.1339 17.9997H15.2816C15.576 18.0044 15.8679 17.9462 16.138 17.829C16.4081 17.7118 16.65 17.5382 16.8476 17.32L17.2318 16.9948L17.5863 16.6402C17.8406 16.3898 17.9887 16.0511 18 15.6944C17.9953 15.5218 17.9563 15.352 17.8853 15.1946C17.8142 15.0373 17.7126 14.8958 17.5863 14.7781L16.1089 13.1526ZM13.8633 14.6895L14.7793 13.7732L13.8633 14.6895ZM12.5632 14.4826L12.8882 14.6599L13.1542 14.8077L12.5632 14.4826ZM10.1994 9.57628L9.5198 10.2561C9.45881 10.3481 9.42628 10.456 9.42628 10.5664C9.42628 10.6768 9.45881 10.7847 9.5198 10.8767C9.72292 11.3948 10.0127 11.8746 10.3767 12.2954L10.1994 9.57628ZM8.8993 6.94579L9.37206 7.41869L9.63799 7.68469L10.3471 8.39404"
                  fill="#212121"
                />
              </svg>
            </span>
            <span className="text-black-3 leading-[21px]">
              {t('footer.hotline')}
            </span>
            <a
              href={`tel:${HOTLINE}`}
              className="text-body-label text-base leading-6  text-white hover:underline"
            >
              {HOTLINE}
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
