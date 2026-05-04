import type {
  NewsCategory,
  NewsHighlightItem,
  NewsItem,
} from '@/services/news/news.schema'

export function getNewsCategoryLabel(
  cat: Pick<NewsCategory, 'categoryNameEn' | 'categoryNameVi'>,
  locale: string,
): string {
  return locale === 'vi' ? cat.categoryNameVi : cat.categoryNameEn
}

/** Maps a `/news/highlight` row to `NewsItem` used by highlights and detail UI. */
export function highlightItemToNewsItem(item: NewsHighlightItem): NewsItem {
  return {
    id: item.id,
    titleEn: item.articleTitleEn,
    titleVi: item.articleTitleVi,
    categoryEn: item.categoryEn,
    categoryVi: item.categoryVi,
    imageUrl: item.thumbnailUrl,
    descriptionEn: item.descriptionEn,
    descriptionVi: item.descriptionVi,
    createDate: item.createdAt,
  }
}

/** Định dạng `createDate` (ISO hoặc chuỗi parse được) theo locale. */
export function formatNewsDate(value: string, locale: string): string {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  const tag = locale === 'vi' ? 'vi-VN' : 'en-GB'
  return new Intl.DateTimeFormat(tag, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(parsed)
}

export type NewsDisplayFields = Readonly<{
  title: string
  description: string
  categoryLabel: string
  imageUrl: string
  dateLabel: string
}>

/** Chọn nhãn EN/VI + ngày hiển thị cho một bản tin. */
export function getNewsDisplayFields(
  item: NewsItem,
  locale: string
): NewsDisplayFields {
  const isVi = locale === 'vi'
  return {
    title: isVi ? item.titleVi : item.titleEn,
    description: isVi ? item.descriptionVi : item.descriptionEn,
    categoryLabel: isVi ? item.categoryVi : item.categoryEn,
    imageUrl: item.imageUrl,
    dateLabel: formatNewsDate(item.createDate, locale),
  }
}
