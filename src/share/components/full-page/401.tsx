import ErrorPage from './error-page'

type Unauthorized401Props = Readonly<{
  message?: string
  code?: string
}>

export default function Unauthorized401(props?: Unauthorized401Props) {
  return <ErrorPage message={props?.message} code={props?.code} defaultCode="401" />
}
