import type { GuideCategory } from '@/services/support/support.schema'

export type GuideNavRow = Readonly<{
  id: string
  titleEn: string
  titleVi: string
}>

export type GuideNavGroup = Readonly<{
  parent: GuideNavRow
  children: GuideNavRow[]
}>

function flattenDescendantRows(node: GuideCategory): GuideNavRow[] {
  const rows: GuideNavRow[] = []
  for (const child of node.children) {
    rows.push({
      id: child.categoryId,
      titleEn: child.categoryNameEn,
      titleVi: child.categoryNameVi,
    })
    rows.push(...flattenDescendantRows(child))
  }
  return rows
}

export function buildGuideNavGroupsFromCategories(
  categories: readonly GuideCategory[],
): GuideNavGroup[] {
  return categories.map((root) => ({
    parent: {
      id: root.categoryId,
      titleEn: root.categoryNameEn,
      titleVi: root.categoryNameVi,
    },
    children: flattenDescendantRows(root),
  }))
}
