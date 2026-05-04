import React from 'react'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { toast } from 'sonner'

import { useDownloadPostmanCollectionMutation } from '../scenario.mutations'

const mockGetScenarioPostmanCollection = jest.fn()
const mockDownloadJsonFile = jest.fn()

jest.mock('../scenario.service', () => ({
  __esModule: true,
  default: {
    getScenarioPostmanCollection: (...args: unknown[]) =>
      mockGetScenarioPostmanCollection(...args),
  },
}))

jest.mock('@/util/download', () => ({
  downloadJsonFile: (...args: unknown[]) => mockDownloadJsonFile(...args),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}))

jest.mock('sonner', () => ({
  toast: {
    dismiss: jest.fn(),
    error: jest.fn(),
  },
}))

const postmanPayload = {
  info: {
    name: 'c',
    description: '',
    schema:
      'https://schema.getpostman.com/json/collection/v2.1.0/collection.json',
  },
  variable: [],
  auth: { type: 'bearer', bearer: [] },
  item: [],
}

function createWrapper() {
  const client = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
  }
}

describe('scenario.mutations', () => {
  beforeEach(() => {
    mockGetScenarioPostmanCollection.mockReset()
    mockDownloadJsonFile.mockReset()
  })

  it('useDownloadPostmanCollectionMutation gọi API và downloadJsonFile khi success', async () => {
    mockGetScenarioPostmanCollection.mockResolvedValue({
      message: 'OK',
      code: '200',
      data: postmanPayload,
    })

    const { result } = renderHook(
      () =>
        useDownloadPostmanCollectionMutation(
          'sc-1',
          'case-1',
          'v-1',
          'api-1',
          'MyCase',
        ),
      { wrapper: createWrapper() },
    )

    result.current.mutate()

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetScenarioPostmanCollection).toHaveBeenCalledWith(
      'sc-1',
      'case-1',
      'v-1',
      'api-1',
    )
    expect(mockDownloadJsonFile).toHaveBeenCalledTimes(1)
    expect(mockDownloadJsonFile).toHaveBeenCalledWith(
      postmanPayload,
      'MyCase.postman_collection.json',
    )
  })

  it('shows translated fallback message when API error has no server message', async () => {
    mockGetScenarioPostmanCollection.mockRejectedValueOnce(new Error('network'))
    const { result } = renderHook(
      () =>
        useDownloadPostmanCollectionMutation(
          'sc-1',
          'case-1',
          'v-1',
          'api-1',
          'MyCase'
        ),
      { wrapper: createWrapper() }
    )

    result.current.mutate()
    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(toast.dismiss).toHaveBeenCalled()
    expect(toast.error).toHaveBeenCalledWith(
      'mess.download_postman_collection.error'
    )
  })
})
