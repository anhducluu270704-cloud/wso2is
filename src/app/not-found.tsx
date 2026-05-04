import NextLink from 'next/link'
import { Error404 } from '@/share/icons'
import { Button } from '@/share/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/share/ui/empty'
import ErrorPageLayout from '@/share/components/full-page/error-layout'

export default function NotFound404() {
  return (
    <ErrorPageLayout>
      <Empty>
        <EmptyHeader>
          <Error404 className="size-[144px]" />
        </EmptyHeader>
        <EmptyContent>
          <EmptyTitle>Uh-oh, service interrupted</EmptyTitle>
          <EmptyDescription>
            The system is unable to process your request
          </EmptyDescription>
          <EmptyDescription className="text-grey-6">
            Support code: 404
          </EmptyDescription>
        </EmptyContent>
        <Button variant="default" size="sm" rounded asChild>
          <NextLink href="/">Got it</NextLink>
        </Button>
      </Empty>
    </ErrorPageLayout>
  )
}
