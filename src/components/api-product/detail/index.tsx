'use client'

import NotFound404 from '@/share/components/full-page/404'
import LoadingPage from '@/share/components/full-page/loading'
import { useGetApiProductDetail } from '@/services/api-product/apiProduct.query-options'
import EUPageLayout from '@/share/layout/end-user/page'
import AboutSection from './about'
import ListApplication from './list-application'
import StepsSection from './steps'

export default function ApiProductDetailWrapper(
  props: Readonly<{
    id: string
    inlinetoasttype: string
    inlinetoastmsgkey: string
  }>
) {
  const { id, inlinetoasttype, inlinetoastmsgkey } = props

  const {
    data: detailData,
    isLoading,
    isError,
    isSuccess,
  } = useGetApiProductDetail(id)

  if (isLoading) return <LoadingPage />
  if (isError) return <NotFound404 />

  if (isSuccess) {
    const apiProduct = detailData.data
    return (
      <EUPageLayout
        title={apiProduct.name}
        description={apiProduct.version}
        headerImageSrc={apiProduct.bannerImage}
        background="bg-apiproduct-detail-ver md:bg-apiproduct-detail-hor"
      >
        <div className="container mx-auto flex flex-col gap-8 md:gap-16 py-8 md:py-16">
          <AboutSection
            description={apiProduct.aboutDescription}
            imageSrc={apiProduct.aboutImage}
            resources={apiProduct.operations}
            documentLink={apiProduct.documentLink}
          />
          <ListApplication
            api_id={id}
            api_product_name={apiProduct.name}
            inlinetoasttype={inlinetoasttype}
            inlinetoastmsgkey={inlinetoastmsgkey}
          />
          <StepsSection />
        </div>
      </EUPageLayout>
    )
  }
}
