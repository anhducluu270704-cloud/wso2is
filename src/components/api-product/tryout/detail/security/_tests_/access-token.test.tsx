import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

const mockMutate = jest.fn()

jest.mock('@/services/application/application.mutations', () => ({
  useGenerateAccessTokenMutation: () => ({ mutate: mockMutate }),
}))

jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
}))

import AccessToken from '../access-token'

describe('tryout AccessToken', () => {
  beforeEach(() => {
    mockMutate.mockReset()
  })

  it('gọi mutate và setAccessToken onSuccess', async () => {
    const setAccessToken = jest.fn()
    mockMutate.mockImplementation((_payload: unknown, opts?: { onSuccess?: (d: unknown) => void }) => {
      opts?.onSuccess?.({
        data: { accessToken: 'atoken' },
      })
    })
    render(
      <AccessToken
        accessToken=""
        setAccessToken={setAccessToken}
        app_id="app-1"
        key_mapping_id="km1"
        consumer_secret="sec"
        additional_properties={{ a: 1 }}
      />,
    )
    await userEvent.click(
      screen.getByRole('button', { name: 'btn.get_access_token' }),
    )
    expect(mockMutate).toHaveBeenCalled()
    expect(setAccessToken).toHaveBeenCalledWith('atoken')
  })
})
