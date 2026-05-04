'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/share/ui/accordion'
import { useTranslations } from 'next-intl'

export default function GuideSection() {
  const t = useTranslations('api_product')

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue="sandbox-guide"
      className="mb-12"
    >
      <AccordionItem
        value="sandbox-guide"
        className="border-none! flex flex-col gap-6"
      >
        <AccordionTrigger className="items-center p-0 text-left text-body-emphasize! text-black-1 [&_svg]:text-black-1! data-closed:border-b! data-closed:border-grey-1/10 data-closed:rounded-none! data-closed:pb-6">
          {t('tryout.guide.title')}
        </AccordionTrigger>
        <AccordionContent className="h-auto border-none p-0 [&>div]:text-black-1">
          <div className="flex flex-col gap-4 text-body-body text-black-1">
            <div className="flex flex-col gap-2">
              <p className="text-black-1! leading-relaxed">
                <strong className="font-bold text-black-1">
                  {t('tryout.guide.step1_label')}
                </strong>{' '}
                {t('tryout.guide.step1_content')}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="text-black-1!">
                <strong className="font-bold">
                  {t('tryout.guide.step2_label')}
                </strong>{' '}
                {t('tryout.guide.step2_content')}
              </p>
            </div>
            <div className="flex flex-col">
              <p className="m-0! text-black-1!">
                <strong className="font-bold">
                  {t('tryout.guide.step3_label')}
                </strong>{' '}
                {t('tryout.guide.step3_title')}
              </p>
              <ul className="m-0! list-disc space-y-0 pl-5 text-black-1! leading-relaxed [&_li]:m-0! [&_li]:mb-0! [&_li]:mt-0!">
                <li>{t('tryout.guide.step3_li1')}</li>
                <li>{t('tryout.guide.step3_li2')}</li>
              </ul>
            </div>
            <div className="flex flex-col">
              <p className="m-0! text-black-1!">
                <strong className="font-bold">
                  {t('tryout.guide.step4_label')}
                </strong>{' '}
                {t('tryout.guide.step4_title')}
              </p>
              <ul className="m-0! list-disc space-y-0 pl-5 text-black-1! leading-relaxed [&_li]:m-0! [&_li]:mb-0! [&_li]:mt-0!">
                <li>{t('tryout.guide.step4_li1')}</li>
                <li>{t('tryout.guide.step4_li2')}</li>
              </ul>
            </div>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
