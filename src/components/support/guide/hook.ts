import type { GuideNavGroup, GuideNavRow } from '@/util/guide-nav'

export function getGuideRowSearchText(row: GuideNavRow): string {
  return [row.titleEn, row.titleVi].join(' ').toLowerCase()
}

export function filterGuideNavGroups(
  groups: readonly GuideNavGroup[],
  keyword: string,
): GuideNavGroup[] {
  const k = keyword.trim().toLowerCase()
  if (!k) return [...groups]

  const result: GuideNavGroup[] = []

  for (const group of groups) {
    const parentMatch = getGuideRowSearchText(group.parent).includes(k)
    const filteredChildren = group.children.filter((c) =>
      getGuideRowSearchText(c).includes(k),
    )
    if (!parentMatch && filteredChildren.length === 0) continue

    const children =
      filteredChildren.length > 0 ? filteredChildren : [...group.children]

    result.push({
      parent: group.parent,
      children,
    })
  }

  return result
}
