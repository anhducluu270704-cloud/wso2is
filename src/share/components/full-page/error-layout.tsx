import { Overlay } from '@/share/icons'

export default function ErrorPageLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="bg-grey-7 relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <div className="absolute top-14 left-0 z-0">
        <Overlay />
      </div>
      <div className="relative container mx-auto">{children}</div>
    </div>
  )
}
