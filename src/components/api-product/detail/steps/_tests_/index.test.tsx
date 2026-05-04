
import React from 'react'
import { render, screen } from '@testing-library/react'
import StepsSection from '../index'

jest.mock('next-intl', () => ({ useTranslations: () => (k: string) => k }))
jest.mock('next/navigation', () => ({ useRouter: () => ({ push: jest.fn() }) }))
jest.mock('@/share/ui/button', () => ({ Button: ({ children }: any) => <button>{children}</button> }))
jest.mock('@/share/icons', () => ({
  Link: () => <span>Link</span>,
  Scan: () => <span>Scan</span>,
  Upload: () => <span>Upload</span>,
  UploadFile: () => <span>UploadFile</span>,
}))

describe('api-product/detail/steps', () => {
  it('render StepsSection', () => {
    render(<StepsSection />)
    expect(screen.getByText('steps.section_title')).toBeInTheDocument()
    expect(screen.getByText('steps.see_guides')).toBeInTheDocument()
    expect(screen.getByText('steps.items.step_1_label')).toBeInTheDocument()
    expect(screen.getByText('steps.items.step_2_description')).toBeInTheDocument()
  })
})