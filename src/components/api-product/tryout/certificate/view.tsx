'use client'

import { useGenrateCertifiate } from '@/services/scenario/scenario.query-options'
import { Button } from '@/share/ui/button'
import { SpinnerCustom } from '@/share/ui/spinner'
import { cn } from '@/share/lib/utils'
import { Download } from 'lucide-react'
import { notFound } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { useTranslations } from 'next-intl'

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

export function CertificateView({ cert_id }: Readonly<{ cert_id: string }>) {
  const {
    data: certificateBlob,
    isLoading: isLoadingCertificate,
    isError: isErrorCertificate,
    isSuccess: isSuccessCertificate,
  } = useGenrateCertifiate(cert_id)
  const t = useTranslations('api_product')
  const [objectUrl, setObjectUrl] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [pdfLoadError, setPdfLoadError] = useState(false)
  const [pageWidth, setPageWidth] = useState(932)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!certificateBlob || !(certificateBlob instanceof Blob)) {
      setObjectUrl(null)
      setNumPages(0)
      setPdfLoadError(false)
      return
    }

    setNumPages(0)
    setPdfLoadError(false)
    const url = URL.createObjectURL(certificateBlob)
    setObjectUrl(url)

    return () => {
      URL.revokeObjectURL(url)
    }
  }, [certificateBlob])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const update = () => {
      const w = el.getBoundingClientRect().width
      setPageWidth(Math.max(280, Math.min(w - 48, 820)))
    }

    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const onDocumentLoadSuccess = useCallback(
    ({ numPages: nextNumPages }: { numPages: number }) => {
      setNumPages(nextNumPages)
      setPdfLoadError(false)
    },
    []
  )

  if (isLoadingCertificate)
    return (
      <div className="bg-white rounded-2xl flex flex-col gap-6">
        <SpinnerCustom className="py-12" />
      </div>
    )

  if (isErrorCertificate) return notFound()

  if (!isSuccessCertificate) return null

  if (!certificateBlob || !(certificateBlob instanceof Blob)) {
    return notFound()
  }

  if (!objectUrl)
    return (
      <div className="bg-white rounded-2xl flex flex-col gap-6">
        <SpinnerCustom className="py-12" />
      </div>
    )

  if (pdfLoadError) return notFound()

  return (
    <div className="relative flex w-full flex-col items-center gap-6">
      <div
        ref={containerRef}
        className={cn(
          'w-full overflow-hidden rounded-2xl border border-grey-9 bg-white p-2'
        )}
      >
        <Document
          file={objectUrl}
          loading={<SpinnerCustom />}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={() => setPdfLoadError(true)}
          className="flex flex-col items-center gap-4"
        >
          {Array.from({ length: numPages }, (_, i) => (
            <Page
              key={i + 1}
              pageNumber={i + 1}
              width={pageWidth}
              // className="bg-white! [&_canvas]:block [&_canvas]:max-w-full [&_canvas]:shadow-sm"
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          ))}
        </Document>
      </div>

      <Button
        asChild
        variant="outline"
        size="lg"
        rounded
        className="absolute bottom-5"
      >
        <a
          href={objectUrl}
          download={`sandbox-certificate-${cert_id}.pdf`}
          className="flex items-center gap-2 w-fit"
        >
          <Download className=" text-black!" aria-hidden />
          {t('btn.download')}
        </a>
      </Button>
    </div>
  )
}
