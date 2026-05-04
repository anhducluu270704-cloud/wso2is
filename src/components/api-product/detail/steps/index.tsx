'use client'

import { Link, Scan, UploadFile } from '@/share/icons'
import { Button } from '@/share/ui/button'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'

type Step = {
  icon: React.ReactNode
  step: string
  title: string
  description: string
}

export default function StepsSection() {
  const t = useTranslations('api_product')
  const router = useRouter()
  const STEPS_DATA: Step[] = [
    {
      icon: <Scan className="size-10" />,
      step: t('steps.items.step_1_label'),
      title: t('steps.items.step_1_title'),
      description: t('steps.items.step_1_description'),
    },
    {
      icon: <Link className="size-10" />,
      step: t('steps.items.step_2_label'),
      title: t('steps.items.step_2_title'),
      description: t('steps.items.step_2_description'),
    },
    {
      icon: <UploadFile className="size-10" />,
      step: t('steps.items.step_3_label'),
      title: t('steps.items.step_3_title'),
      description: t('steps.items.step_3_description'),
    },
  ]

  return (
    <div className="flex flex-col gap-8">
      {/* Left side - Title and Button */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 md:gap-8">
        <div className="text-headline-md-mobile md:text-headline-md-desktop text-black-1">
          {t('steps.section_title')}
        </div>
        <Button
          variant="outline"
          size="sm"
          rounded
          onClick={() => router.push('/support')}
        >
          {t('steps.see_guides')}
        </Button>
      </div>

      {/* Right side - Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10 bg-grey-7 px-8 py-6 rounded-xl">
        {STEPS_DATA.map((item) => (
          <div key={item.step} className="flex flex-col gap-[14px]">
            <div className="flex size-10 items-center justify-center">
              {item.icon}
            </div>
            <div className="flex flex-col gap-1">
              <div className="text-body-body">{item.step}</div>
              <div className="text-title-md">{item.title}</div>
              <div className="text-body-body text-grey-5">
                {item.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
