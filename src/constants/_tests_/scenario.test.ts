import { SCENARIO_STATUS } from '../scenario'

describe('constants/scenario', () => {
  it('SCENARIO_STATUS chứa PASS, FAIL, PENDING', () => {
    expect(SCENARIO_STATUS).toEqual(['PASS', 'FAIL', 'PENDING'])
  })
})
