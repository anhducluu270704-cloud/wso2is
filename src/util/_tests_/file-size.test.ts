import { formatFileSize } from '../file-size'

describe('formatFileSize', () => {
  it('returns em dash for non-finite or negative input', () => {
    expect(formatFileSize(NaN)).toBe('—')
    expect(formatFileSize(Infinity)).toBe('—')
    expect(formatFileSize(-1)).toBe('—')
  })

  it('formats bytes when under 1 KiB', () => {
    expect(formatFileSize(0)).toBe('0 B')
    expect(formatFileSize(1)).toBe('1 B')
    expect(formatFileSize(1023)).toBe('1023 B')
  })

  it('KiB: one decimal when v < 10, strips trailing .0', () => {
    expect(formatFileSize(1024)).toBe('1 KB')
    expect(formatFileSize(1536)).toBe('1.5 KB')
    expect(formatFileSize(1024 * 9)).toBe('9 KB')
  })

  it('KiB: whole number when v >= 10', () => {
    expect(formatFileSize(1024 * 10)).toBe('10 KB')
    expect(formatFileSize(1024 * 99)).toBe('99 KB')
  })

  it('MiB: fractional and whole branches', () => {
    expect(formatFileSize(1024 ** 2)).toBe('1 MB')
    expect(formatFileSize(Math.floor(1024 ** 2 * 2.5))).toBe('2.5 MB')
    expect(formatFileSize(1024 ** 2 * 10)).toBe('10 MB')
  })

  it('GiB: fractional and whole branches', () => {
    expect(formatFileSize(1024 ** 3)).toBe('1 GB')
    expect(formatFileSize(Math.floor(1024 ** 3 * 3.25))).toBe('3.3 GB')
    expect(formatFileSize(1024 ** 3 * 10)).toBe('10 GB')
  })
})
