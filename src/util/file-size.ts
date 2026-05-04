export function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return '—'
  const k = 1024
  if (bytes < k) return `${bytes} B`
  if (bytes < k * k) {
    const v = bytes / k
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')} KB`
  }
  if (bytes < k * k * k) {
    const v = bytes / (k * k)
    return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')} MB`
  }
  const v = bytes / (k * k * k)
  return `${v >= 10 ? v.toFixed(0) : v.toFixed(1).replace(/\.0$/, '')} GB`
}
