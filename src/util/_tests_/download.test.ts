import { downloadJsonFile } from '../download'

describe('downloadJsonFile', () => {
  it('tạo blob JSON, anchor download và revoke URL', () => {
    const originalCreateObjectURL = URL.createObjectURL
    const originalRevokeObjectURL = URL.revokeObjectURL
    URL.createObjectURL = jest.fn(() => 'blob:test')
    URL.revokeObjectURL = jest.fn()

    const clickSpy = jest.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = jest
      .spyOn(document, 'createElement')
      .mockImplementation(((tagName: string) => {
        if (tagName === 'a') {
          return {
            href: '',
            download: '',
            click: clickSpy,
          } as unknown as HTMLAnchorElement
        }
        return originalCreateElement(tagName)
      }) as typeof document.createElement)

    downloadJsonFile({ a: 1 }, 'out.json')

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(clickSpy).toHaveBeenCalledTimes(1)
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:test')

    createElementSpy.mockRestore()
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })
})
