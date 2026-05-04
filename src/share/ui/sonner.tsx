'use client'

import { cn } from '@/share/lib/utils'
import { Loader2Icon } from 'lucide-react'
import { useTheme } from 'next-themes'
import type { CSSProperties } from 'react'
import {
  Toaster as Sonner,
  type ExternalToast,
  type ToasterProps,
} from 'sonner'
import { ToastError, ToastInfo, ToastSuccess } from '../icons'

export type ToastSize = 'default' | 'lg'

type ToasterPropsWithSize = ToasterProps & {
  /** `default` is the compact toast (icon `size-10`); `lg` is the large variant. @default 'default' */
  toastSize?: ToastSize
}

const toastSizePresets: Record<
  ToastSize,
  {
    toasterClass: string
    toastClass: string
    iconClass: string
    style: CSSProperties
  }
> = {
  default: {
    toasterClass: 'toaster-size-default',
    toastClass: 'cn-toast cn-toast--default',
    iconClass: 'size-10',
    style: {
      padding: '8px 16px',
      gap: '10px',
      borderRadius: '18px',
      boxShadow: '0px 6px 16px 2px #0000001F',
    },
  },
  lg: {
    toasterClass: 'toaster-size-lg',
    toastClass: 'cn-toast cn-toast--lg',
    iconClass: 'size-16',
    style: {
      padding: '24px 32px',
      gap: '36px',
      borderRadius: '16px',
      boxShadow: '0px 6px 16px 2px #0000001F',
    },
  },
}

export function toastSuccessOptionsForSize(size: ToastSize): ExternalToast {
  const p = toastSizePresets[size]
  return {
    classNames: {
      toast: p.toastClass,
      icon: cn('toast-icon', p.iconClass),
    },
    style: { ...p.style },
    icon: <ToastSuccess className={p.iconClass} />,
  }
}

const Toaster = ({
  toastSize = 'default',
  className,
  toastOptions: toastOptionsProp,
  ...rest
}: Readonly<ToasterPropsWithSize>) => {
  const { theme = 'system' } = useTheme()
  const preset = toastSizePresets[toastSize]

  return (
    <Sonner
      theme={theme as ToasterProps['theme']}
      className={cn('toaster group', preset.toasterClass, className)}
      position="top-right"
      duration={5000}
      offset={{ top: '74px' }}
      icons={{
        success: <ToastSuccess className={preset.iconClass} />,
        info: <ToastInfo className={preset.iconClass} />,
        error: <ToastError className={preset.iconClass} />,
        loading: (
          <Loader2Icon
            className={cn(preset.iconClass, 'animate-spin text-blue-2')}
          />
        ),
      }}
      style={
        {
          '--normal-bg': 'var(--popover)',
          '--normal-text': 'var(--popover-foreground)',
          '--normal-border': '16px',
          '--border-radius': 'var(--radius)',
          '--width': 'max-content',
          '--offset-top': '74px',
        } as CSSProperties
      }
      toastOptions={{
        ...toastOptionsProp,
        classNames: {
          ...toastOptionsProp?.classNames,
          toast: cn(preset.toastClass, toastOptionsProp?.classNames?.toast),
          icon: cn('toast-icon', toastOptionsProp?.classNames?.icon),
        },
        style: {
          ...preset.style,
          ...toastOptionsProp?.style,
        },
      }}
      {...rest}
    />
  )
}

export { Toaster }
