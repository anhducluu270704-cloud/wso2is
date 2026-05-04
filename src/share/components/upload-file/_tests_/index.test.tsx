import { describe, it, expect, jest, beforeEach } from '@jest/globals'

jest.mock('next-intl', () => ({
  useTranslations: () => {
    const fn = (key: string) => key
    fn.rich = (key: string) => key
    return fn
  },
}))

jest.mock('sonner', () => {
  const toastError = jest.fn()
  const toastInfo = jest.fn()
  return {
    toast: {
      error: toastError,
      info: toastInfo,
    },
  }
})

const mockRdd = {
  lastHandleChange: null as null | ((f: File | File[]) => void),
  lastTypes: undefined as string[] | string | undefined,
}

jest.mock('@/share/icons', () => {
  const ReqReact = require('react')
  return {
    FileUploadIcon: (props: Record<string, unknown>) =>
      ReqReact.createElement('span', { 'data-testid': 'file-upload-icon', ...props }),
    DeleteIcon: (props: Record<string, unknown>) =>
      ReqReact.createElement('span', { 'data-testid': 'delete-icon', ...props }),
  }
})

jest.mock('@/share/ui/button', () => {
  const ReqReact = require('react')
  return {
    Button: ({ children, onClick, ...rest }: any) =>
      ReqReact.createElement(
        'button',
        { type: 'button', onClick, ...rest },
        children,
      ),
  }
})

jest.mock('react-drag-drop-files', () => {
  const ReqReact = require('react')
  return {
    FileUploader: ({
      handleChange,
      children,
      types,
    }: {
      handleChange: (files: File | File[]) => void
      children?: unknown
      types?: string[]
    }) => {
      mockRdd.lastHandleChange = handleChange
      mockRdd.lastTypes = types
      return ReqReact.createElement(
        'div',
        null,
        ReqReact.createElement(
          'button',
          {
            type: 'button',
            onClick: () =>
              handleChange(
                new File(['content'], 'file-1.txt', { type: 'text/plain' })
              ),
          },
          'FileUploader'
        ),
        children
      )
    },
  }
})

import React from 'react'
import { fireEvent, render, screen, act } from '@testing-library/react'

function getUploadFile() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('../index').default as React.ComponentType<{
    onFilesChange?: (files: File[]) => void
    maxFiles?: number
    multiple?: boolean
  }>
}

function getToast() {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  return require('sonner').toast as { error: jest.Mock; info: jest.Mock }
}

describe('UploadFile', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockRdd.lastHandleChange = null
    mockRdd.lastTypes = undefined
  })

  it('renders uploader and helper text', () => {
    const UploadFile = getUploadFile()
    render(<UploadFile />)

    expect(screen.getByText('FileUploader')).toBeInTheDocument()
    expect(
      screen.getByText('upload_file.drop_zone.upload_action'),
    ).toBeInTheDocument()
  })

  it('adds files, shows list and calls onFilesChange', () => {
    const UploadFile = getUploadFile()
    const handleFilesChange = jest.fn()
    render(<UploadFile onFilesChange={handleFilesChange} maxFiles={5} />)

    fireEvent.click(screen.getByText('FileUploader'))

    expect(screen.getByText('file-1.txt')).toBeInTheDocument()
    expect(screen.getByText('7 B')).toBeInTheDocument()
    expect(handleFilesChange).toHaveBeenCalledTimes(1)
    expect(handleFilesChange.mock.calls[0][0][0]).toBeInstanceOf(File)
    expect(handleFilesChange.mock.calls[0][0][0].name).toBe('file-1.txt')
  })

  it('limits number of files and shows toast.error when exceeding maxFiles', () => {
    const UploadFile = getUploadFile()
    const fileA = new File(['a'], 'a.txt', { type: 'text/plain' })
    const fileB = new File(['b'], 'b.txt', { type: 'text/plain' })
    const fileC = new File(['c'], 'c.txt', { type: 'text/plain' })

    render(<UploadFile multiple maxFiles={2} />)

    act(() => {
      mockRdd.lastHandleChange?.([fileA, fileB, fileC])
    })

    expect(screen.getByText('a.txt')).toBeInTheDocument()
    expect(screen.getByText('b.txt')).toBeInTheDocument()
    expect(screen.queryByText('c.txt')).not.toBeInTheDocument()
    expect(getToast().error).toHaveBeenCalled()
  })

  it('removes file when delete button clicked and calls onFilesChange', () => {
    const UploadFile = getUploadFile()
    const handleFilesChange = jest.fn()

    render(<UploadFile onFilesChange={handleFilesChange} />)

    fireEvent.click(screen.getByText('FileUploader'))
    expect(screen.getByText('file-1.txt')).toBeInTheDocument()

    fireEvent.click(screen.getByTestId('delete-icon').closest('button')!)

    expect(screen.queryByText('file-1.txt')).not.toBeInTheDocument()
    const lastCallArgs =
      handleFilesChange.mock.calls[handleFilesChange.mock.calls.length - 1][0]
    expect(lastCallArgs).toEqual([])
  })

  it('set validation error khi file vượt maxFileBytes', () => {
    const UploadFile = getUploadFile()
    render(<UploadFile maxFileBytes={5} />)
    const big = new File(['1234567890'], 'big.txt', { type: 'text/plain' })
    act(() => {
      mockRdd.lastHandleChange?.(big)
    })
    expect(screen.getByRole('alert')).toHaveTextContent(
      'upload_file.error.max_file_size'
    )
  })

  it('uses undefined types when acceptedTypes is *', () => {
    const UploadFile = getUploadFile()
    render(<UploadFile acceptedTypes="*" />)
    expect(mockRdd.lastTypes).toBeUndefined()
  })

  it('splits acceptedTypes for FileUploader types', () => {
    const UploadFile = getUploadFile()
    render(<UploadFile acceptedTypes="png,jpg" />)
    expect(mockRdd.lastTypes).toEqual(['png', 'jpg'])
  })

  it('multiple mode appends second file on next change', () => {
    const UploadFile = getUploadFile()
    const onFilesChange = jest.fn()
    render(<UploadFile multiple maxFiles={5} onFilesChange={onFilesChange} />)
    const a = new File(['a'], 'a.txt', { type: 'text/plain' })
    const b = new File(['b'], 'b.txt', { type: 'text/plain' })
    act(() => {
      mockRdd.lastHandleChange?.(a)
    })
    act(() => {
      mockRdd.lastHandleChange?.(b)
    })
    expect(screen.getByText('a.txt')).toBeInTheDocument()
    expect(screen.getByText('b.txt')).toBeInTheDocument()
    expect(onFilesChange).toHaveBeenLastCalledWith(
      expect.arrayContaining([
        expect.objectContaining({ name: 'a.txt' }),
        expect.objectContaining({ name: 'b.txt' }),
      ]),
    )
  })

  it('single file mode: duplicate in same batch shows toast and keeps one file', () => {
    const UploadFile = getUploadFile()
    const toastInfo = getToast().info
    render(<UploadFile multiple={false} maxFiles={5} />)
    const f = new File(['x'], 'dup.txt', {
      type: 'text/plain',
      lastModified: 42,
    })
    act(() => {
      mockRdd.lastHandleChange?.([f, f])
    })
    expect(toastInfo).toHaveBeenCalled()
    expect(screen.getAllByText('dup.txt').length).toBe(1)
  })

  it('không cập nhật file khi validateFile trả false', () => {
    const UploadFile = getUploadFile()
    const handleFilesChange = jest.fn()
    render(
      <UploadFile
        validateFile={(f) => f.name.endsWith('.pdf')}
        onFilesChange={handleFilesChange}
      />
    )
    fireEvent.click(screen.getByText('FileUploader'))
    expect(handleFilesChange).not.toHaveBeenCalled()
    expect(screen.queryByText('file-1.txt')).not.toBeInTheDocument()
  })
})
