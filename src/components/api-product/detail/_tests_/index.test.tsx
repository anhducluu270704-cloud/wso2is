
import React from 'react'
import { render, screen } from '@testing-library/react'
import ApiProductDetailWrapper from '../index'

jest.mock('@/services/api-product/apiProduct.query-options', () => ({
  useGetApiProductDetail: jest.fn(),
}))
jest.mock('@/share/components/full-page/404', () => ({
  __esModule: true,
  default: () => <div>404</div>,
}))
jest.mock('@/share/components/full-page/loading', () => ({
  __esModule: true,
  default: () => <div>Loading</div>,
}))
jest.mock('@/share/layout/end-user/page', () => ({
  __esModule: true,
  default: ({ title, children }: any) => (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  ),
}))
jest.mock('../about', () => ({
  __esModule: true,
  default: () => <div>AboutSection</div>,
}))
jest.mock('../list-application', () => ({
  __esModule: true,
  default: () => <div>ListApplication</div>,
}))
jest.mock('../steps', () => ({
  __esModule: true,
  default: () => <div>StepsSection</div>,
}))

const useGetApiProductDetail =
  require('@/services/api-product/apiProduct.query-options').useGetApiProductDetail

describe('api-product/detail/index', () => {
  it('render Loading khi isLoading', () => {
    useGetApiProductDetail.mockReturnValue({
      data: null,
      isLoading: true,
      isError: false,
      isSuccess: false,
    })
    render(<ApiProductDetailWrapper id="api-1" />)
    expect(screen.getByText('Loading')).toBeInTheDocument()
  })

  it('render 404 khi isError', () => {
    useGetApiProductDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: true,
      isSuccess: false,
    })
    render(<ApiProductDetailWrapper id="api-1" />)
    expect(screen.getByText('404')).toBeInTheDocument()
  })

  it('render detail khi isSuccess', () => {
    useGetApiProductDetail.mockReturnValue({
      data: {
        data: {
          name: 'Payment API',
          bannerDescription: 'Desc',
          bannerImage: null,
          aboutDescription: '',
          aboutImage: null,
          operations: [],
        },
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
    })
    render(<ApiProductDetailWrapper id="api-1" />)
    expect(screen.getByText('Payment API')).toBeInTheDocument()
    expect(screen.getByText('AboutSection')).toBeInTheDocument()
    expect(screen.getByText('ListApplication')).toBeInTheDocument()
    expect(screen.getByText('StepsSection')).toBeInTheDocument()
  })

  it('render detail với description fallback rỗng', () => {
    useGetApiProductDetail.mockReturnValue({
      data: {
        data: {
          name: 'Fallback API',
          bannerDescription: null,
          bannerImage: null,
          aboutDescription: '',
          aboutImage: null,
          operations: [],
        },
      },
      isLoading: false,
      isError: false,
      isSuccess: true,
    })

    render(<ApiProductDetailWrapper id="api-2" />)

    expect(screen.getByText('Fallback API')).toBeInTheDocument()
  })

  it('không render gì khi chưa ở trạng thái success/loading/error', () => {
    useGetApiProductDetail.mockReturnValue({
      data: null,
      isLoading: false,
      isError: false,
      isSuccess: false,
    })

    const { container } = render(<ApiProductDetailWrapper id="api-3" />)

    expect(container).toBeEmptyDOMElement()
  })
})
