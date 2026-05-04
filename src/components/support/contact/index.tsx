'use client'

import { cn } from '@/share/lib/utils'
import { Card, CardContent } from '@/share/ui/card'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import { SupportRequestModal } from '../modal/create'
import PhoneIconSvg from '@/share/icons/icon-contact-phone.svg'
import EmailIconSvg from '@/share/icons/icon-contact-email.svg'
import StatementIconSvg from '@/share/icons/icon-contact-statement.svg'

export function SupportContact() {
  const t = useTranslations('support.contact')
  const [requestModalOpen, setRequestModalOpen] = useState(false)

  const items = [
    {
      icon: <PhoneIconSvg className="size-12 stroke-[1.5] text-black-1" />,
      label: t('hotline'),
      value: t('hotline_value'),
    },
    {
      icon: <EmailIconSvg className="size-12 stroke-[1.5] text-black-1" />,
      label: t('email'),
      value: t('email_value'),
    },
    {
      icon: <StatementIconSvg className="size-12 stroke-[1.5] text-black-1" />,
      label: t('leave_request'),
      value: null,
      onClick: () => setRequestModalOpen(true),
    },
  ]

  return (
    <section className="w-full bg-grey-11 py-20 flex flex-1 flex-col">
      <SupportRequestModal
        open={requestModalOpen}
        onClose={() => setRequestModalOpen(false)}
      />
      <div className="container mx-auto flex flex-col gap-6">
        <div className="w-full flex flex-col gap-2.5">
          <h2 className="text-headline-lg-mobile text-black">{t('heading')}</h2>
          <p className="text-title-md text-grey-5">{t('subheading')}</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map(({ icon, label, value, onClick }) => {
            const content = (
              <>
                <div className="flex size-12 shrink-0 items-center justify-center">
                  {icon}
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-body-emphasize text-black">
                    {label}
                  </span>
                  {value && (
                    <span className="text-title-md text-grey-5">{value}</span>
                  )}
                </div>
              </>
            )
            const cardClassName = cn(
              'overflow-hidden rounded-xl border-none ring-0 bg-white px-4 py-8 shadow-none',
              onClick && 'cursor-pointer transition-opacity hover:opacity-90'
            )

            return onClick ? (
              <button
                key={label}
                type="button"
                onClick={onClick}
                data-testid="card-button"
                className={cn(
                  cardClassName,
                  'flex flex-col items-start gap-4 text-left'
                )}
              >
                {content}
              </button>
            ) : (
              <Card key={label} className={cardClassName}>
                <CardContent className="flex flex-col items-start gap-4 border-none ring-0 p-0 text-left">
                  {content}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
