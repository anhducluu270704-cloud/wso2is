
import React from 'react'
import { fireEvent, render, screen } from '@testing-library/react'
import AboutSection from '../index'

const mockPush = jest.fn()
const mockMutate = jest.fn()
const mockOpenModal = jest.fn()
const mockCloseModal = jest.fn()
const mockUseAuthSession = jest.fn()
const mockUseModal = jest.fn()

jest.mock('@/i18n/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    prefetch: jest.fn(),
  }),
}))
jest.mock('next-intl', () => ({
  useTranslations: () => (k: string) => k,
  useLocale: () => 'en',
}))
jest.mock('next/image', () => ({
  __esModule: true,
  default: (p: any) => <img src={p.src} alt={p.alt} />,
}))
jest.mock('../table', () => ({
  __esModule: true,
  default: () => <div>ApiResourceTable</div>,
}))
jest.mock('@/share/ui/button', () => ({
  Button: ({ children, onClick }: any) => <button onClick={onClick}>{children}</button>,
}))
jest.mock('@/share/hooks/use-modal', () => ({
  useModal: () => mockUseModal(),
}))
jest.mock('@/providers/auth-session-provider', () => ({
  useAuthSession: () => mockUseAuthSession(),
}))
jest.mock('@/share/layout/end-user/header/hook', () => ({
  useGetUrlLoginMutation: () => ({
    mutate: mockMutate,
  }),
}))
jest.mock('@/share/ui/dialog', () => ({
  Dialog: ({ children, open }: any) => (open ? <div>{children}</div> : null),
  DialogContent: ({ children }: any) => <div>{children}</div>,
  DialogFooter: ({ children }: any) => <div>{children}</div>,
  DialogHeader: ({ children }: any) => <div>{children}</div>,
  DialogTitle: ({ children }: any) => <div>{children}</div>,
}))

describe('api-product/detail/about', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuthSession.mockReturnValue({ authSession: null })
    mockUseModal.mockReturnValue({
      isOpen: false,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    })
  })

  it('render AboutSection với description', () => {
    render(<AboutSection description="API description" resources={[]} />)
    expect(screen.getByText('about.title')).toBeInTheDocument()
    expect(screen.getByText('API description')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'about.spec_button' })
    ).toBeInTheDocument()
    expect(screen.getByText('ApiResourceTable')).toBeInTheDocument()
  })

  it('render AboutSection không hiển thị description khi null', () => {
    render(<AboutSection resources={[]} />)
    expect(screen.getByText('about.title')).toBeInTheDocument()
    expect(screen.queryByText('API description')).not.toBeInTheDocument()
  })

  it('click spec button opens login modal when no auth session', () => {
    render(<AboutSection resources={[]} />)
    fireEvent.click(screen.getByRole('button', { name: 'about.spec_button' }))
    expect(mockOpenModal).toHaveBeenCalled()
  })

  it('click spec button opens document when auth session exists', () => {
    const openSpy = jest.spyOn(window, 'open').mockImplementation(() => null)
    mockUseAuthSession.mockReturnValue({ authSession: { sub: 'u1' } })

    render(
      <AboutSection
        resources={[]}
        documentLink="https://example.com/spec.pdf"
      />
    )
    fireEvent.click(screen.getByRole('button', { name: 'about.spec_button' }))

    expect(openSpy).toHaveBeenCalledWith(
      'https://example.com/spec.pdf',
      '_blank',
      'noopener,noreferrer'
    )
    openSpy.mockRestore()
  })

  it('dialog actions call signup and login handlers', () => {
    mockUseModal.mockReturnValue({
      isOpen: true,
      openModal: mockOpenModal,
      closeModal: mockCloseModal,
    })
    render(<AboutSection resources={[]} />)

    fireEvent.click(screen.getByText('btn.signup'))
    expect(mockPush).toHaveBeenCalledWith('/signup')

    fireEvent.click(screen.getByText('btn.login'))
    expect(mockMutate).toHaveBeenCalled()
  })
})
