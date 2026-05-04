import ErrorPage from './error-page'

type NotFound404Props = Readonly<{
  message?: string
  code?: string
}>

export default function NotFound404(props?: NotFound404Props) {
  return <ErrorPage message={props?.message} code={props?.code} defaultCode="404" />
}
