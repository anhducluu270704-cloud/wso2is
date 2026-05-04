/** Xác định nav active: so khớp pathname (không kèm query) với segment `url` hoặc route con (`url/...`). */
export function isHeaderNavRouteActive(pathname: string, url: string): boolean {
  const base = pathname.split('?')[0] ?? pathname
  return base === url || base.startsWith(`${url}/`)
}
