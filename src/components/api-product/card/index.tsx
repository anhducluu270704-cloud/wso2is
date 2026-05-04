'use client'

import { useRouter } from '@/i18n/navigation'
import { useGetApiProductThumbnail } from '@/services/api-product/apiProduct.query-options'
import { GetApiProductResponse } from '@/services/api-product/apiProduct.schema'
import { Card, CardContent } from '@/share/ui/card'
import { Layers } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

type ProductCardProps = Readonly<{
  product: GetApiProductResponse
}>

export function ProductCard({ product }: Readonly<ProductCardProps>) {
  const t = useTranslations('api_product')
  const router = useRouter()
  const { data: blob } = useGetApiProductThumbnail(product.id)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)

  useEffect(() => {
    if (!blob) {
      setThumbnailUrl(null)
      return
    }
    const url = URL.createObjectURL(blob)
    setThumbnailUrl(url)
    return () => URL.revokeObjectURL(url)
  }, [blob])

  return (
    <Card
      onClick={() => router.push(`/api-products/${product.id}`)}
      className="group h-full cursor-pointer border-transparent bg-white p-0 shadow-none ring-0 gap-4"
    >
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-xl bg-grey-8">
        {thumbnailUrl && (
          <Image
            src={thumbnailUrl}
            alt={product.name}
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>
      <CardContent className="flex flex-1 flex-col gap-4">
        <div className="flex flex-1 flex-col gap-1">
          <h3 className="line-clamp-1 truncate text-title-md">
            {product.name}
          </h3>
          <p className="line-clamp-3 text-body-body text-grey-6">
            {product.description}
          </p>
        </div>
        <div className="flex items-center justify-between gap-2">
          <span className="flex items-center w-fit bg-grey-12 gap-1 p-2 rounded-[31px] text-body-body text-grey-6">
            <Layers className="size-4 text-grey-6" />
            {t('card.api_count', { count: product.resourceCount })}
          </span>
          <span className="text-grey-6">Version {product.version}</span>
        </div>
      </CardContent>
    </Card>
  )
}
