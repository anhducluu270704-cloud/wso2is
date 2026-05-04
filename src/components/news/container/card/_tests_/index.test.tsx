
import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NewsSectionCard } from '../index'

const mockPush = jest.fn()
jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

jest.mock('next-intl', () => ({
  useLocale: () => 'en',
}))

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ fill, ...props }: any) => <img {...props} />,
}))

describe('components/news/container/card', () => {
  beforeEach(() => {
    mockPush.mockClear()
  })

  it('renders title/date and navigates on click', async () => {
    const user = userEvent.setup()
    render(
      <NewsSectionCard
        item={{
          id: '123',
          titleEn: 'Hello',
          titleVi: 'Xin chào',
          categoryEn: 'Cat',
          categoryVi: 'Mục',
          descriptionEn: '',
          descriptionVi: '',
          imageUrl: '/img.png',
          createDate: '2026-06-01T00:00:00.000Z',
        }}
      />
    )

    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByText('1 June 2026')).toBeInTheDocument()

    await user.click(screen.getByRole('button'))
    expect(mockPush).toHaveBeenCalledWith('/news/123')
  })
})
