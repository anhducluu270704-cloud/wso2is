import { SpinnerCustom } from '@/share/ui/spinner'

export default function LoadingPage() {
  return (
    <div className="flex flex-1 flex-col justify-center items-center min-h-screen">
      <SpinnerCustom />
    </div>
  )
}
