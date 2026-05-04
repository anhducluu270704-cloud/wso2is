import { useTranslations } from 'next-intl'
import EUHeader from '../end-user/header'

export default function AuthViewLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const t = useTranslations('layout')
  return (
    <div className="relative overflow-hidden">
      <EUHeader />
      <main className="w-full flex items-center h-screen overflow-hidden bg-[url(/images/auth/background.png)] bg-center bg-no-repeat bg-cover">
        <div className="container mx-auto w-full flex items-center h-full justify-center">
          {children}
        </div>
      </main>
      <footer className="absolute bottom-6 left-0 right-0 w-full">
        <div className="container mx-auto flex flex-1 justify-center items-center">
          <p className="text-body-helptext text-white">
            {t('footer.copyright')}
          </p>
        </div>
      </footer>
    </div>
  )
}
