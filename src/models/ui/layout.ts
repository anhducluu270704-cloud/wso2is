export type BreadcrumbTrailItem = {
  label: string
  href?: string
}


export type EUPageLayoutProps = Readonly<{
  background?: string
  className?: string
  title: string
  description?: string
  headerImageSrc: string
  /** Optional breadcrumb: Home > ... trail. Last item is current page (no href). */
  breadcrumbTrail?: BreadcrumbTrailItem[]
  children: React.ReactNode
}>

export type EUHeaderItemsProps = Readonly<
  {
    title: string
    url: string
    subItems?: ReadonlyArray<{
      title: string
      url: string
    }>
  }[]
>