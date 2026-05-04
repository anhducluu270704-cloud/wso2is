
import {
  AlertLogout,
  ChevronDown,
  Error404,
  Empty,
  EndTime,
  VerifySuccess,
  Public,
  User,
} from '@/share/icons'

describe('share/icons', () => {
  it('export các icon components', () => {
    expect(AlertLogout).toBeDefined()
    expect(ChevronDown).toBeDefined()
    expect(Error404).toBeDefined()
    expect(Empty).toBeDefined()
    expect(EndTime).toBeDefined()
    expect(VerifySuccess).toBeDefined()
    expect(Public).toBeDefined()
    expect(User).toBeDefined()
  })
})