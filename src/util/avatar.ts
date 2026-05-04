export function getInitials(name: string | undefined | null): string {
  if (!name?.trim()) return '?'
  const words = name.trim().split(/\s+/).filter(Boolean)
  if (words.length === 0) return '?'
  if (words.length === 1) {
    const w = words[0]
    return (w[0] + (w[1] ?? w[0])).toUpperCase()
  }
  const letters = words.map((w) => w[0]).join('').toUpperCase()
  return letters.length >= 2 ? letters.slice(-2) : letters
}