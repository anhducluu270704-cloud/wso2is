'use client'

import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/providers/auth-provider'
import { useAuthSession } from '@/providers/auth-session-provider'
import { AlertLogout, Certificate, ChevronDown, User } from '@/share/icons'
import { Avatar, AvatarFallback } from '@/share/ui/avatar'
import { Button } from '@/share/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/share/ui/dropdown-menu'
import { getInitials } from '@/util/avatar'
import { LogOut } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'
import ConfirmModal from '../modal/confirm'

export default function UserDropdown() {
  const router = useRouter()
  const { logout } = useAuth()
  const { authSession } = useAuthSession()
  const t = useTranslations('layout')
  const [open, setOpen] = useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            className="text-body-body h-16 rounded-none px-4 py-2.5 border-l border-grey-1/10"
          >
            <Avatar>
              <AvatarFallback>
                {getInitials(authSession?.user_info?.fullName)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="!stroke-2 !text-black-2 size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="min-w-[216px]">
          <DropdownMenuItem onClick={() => router.push('/profile')}>
            <User className="size-4" />
            {t('header.myaccount')}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push('/certificate')}>
            <Certificate className="size-4" />
            {t('header.certificate')}
          </DropdownMenuItem>
          {/* <DropdownMenuItem onClick={() => router.push('/reg-ticket')}>
            <Certificate className="size-4" />
            {t('header.reg_ticket')}
          </DropdownMenuItem> */}
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <LogOut className="size-4" />
            {t('header.logout')}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmModal
        open={open}
        onOpenChange={setOpen}
        title={t('confirm.logout.title')}
        description={t('confirm.logout.description')}
        onConfirm={() => {
          logout()
          setOpen(false)
        }}
        confirmTitle={t('header.logout')}
        icon={<AlertLogout className="size-36" />}
        className="!max-w-[407px]"
      />
    </>
  )
}
