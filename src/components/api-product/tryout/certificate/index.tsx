import { ScenarioCertificateDetail } from '@/services/scenario/scenario.schema'
import EmptyState from '@/share/components/empty-state'
import { useTranslations } from 'next-intl'
import { CertificateView } from './view'

type TryoutCertificateProps = {
  certificate?: ScenarioCertificateDetail | null
}

export default function TryoutCertificate({
  certificate,
}: Readonly<TryoutCertificateProps>) {
  const t = useTranslations('api_product')

  return (
    <>
      {certificate != null ? (
        <CertificateView cert_id={certificate.id} />
      ) : (
        <EmptyState
          title={t('empty.certificate.title')}
          description={t('empty.certificate.description')}
          type="info"
          className="bg-white rounded-2xl py-0"
        />
      )}
    </>
  )
}
