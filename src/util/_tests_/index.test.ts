
import {
  getTitleByPath,
  trimObject,
  convertDataToParams,
  decodeJwtPayloadWithoutVerification,
} from '@/util'

describe('getTitleByPath', () => {
  const navItems = [
    {
      items: [
        { title: 'Home', url: '/home' },
        {
          title: 'Docs',
          items: [{ title: 'API', url: '/api' }],
        },
      ],
    },
  ]

  it('should find title in first level', () => {
    expect(getTitleByPath(navItems, '/home')).toBe('Home')
  })

  it('should find title in nested level', () => {
    expect(getTitleByPath(navItems, '/api')).toBe('API')
  })

  it('should return empty if not found', () => {
    expect(getTitleByPath(navItems, '/none')).toBe('')
  })
})

describe('trimObject', () => {
  it('should trim string values', () => {
    const obj = { name: '  hello   world  ' }

    const result = trimObject(obj)

    expect(result.name).toBe('hello world')
  })

  it('should remove empty string when option enabled', () => {
    const obj = { name: '   ' }

    const result = trimObject(obj, { removeEmptyString: true })

    expect(result.name).toBeUndefined()
  })

  it('should trim nested object', () => {
    const obj = { user: { name: '  john  ' } }

    const result = trimObject(obj)

    expect(result.user.name).toBe('john')
  })

  it('should process arrays', () => {
    const obj = {
      tags: ['a', '', 'b'],
    }

    const result = trimObject(obj, { removeEmptyString: true })

    expect(result.tags).toEqual(['a', 'b'])
  })

  it('should remove empty object in array', () => {
    const obj = {
      list: [{ name: '  ' }],
    }

    const result = trimObject(obj, {
      removeEmptyString: true,
      removeEmptyObject: true,
    })

    expect(result.list).toBeUndefined()
  })

  it('should keep empty arrays when removeEmptyObject is disabled', () => {
    const obj = {
      list: [''],
    }

    const result = trimObject(obj, {
      removeEmptyString: true,
    })

    expect(result.list).toEqual([])
  })

  it('should remove nested empty object when options are enabled', () => {
    const obj = {
      profile: {
        note: '   ',
      },
    }

    const result = trimObject(obj, {
      removeEmptyString: true,
      removeEmptyObject: true,
    })

    expect(result.profile).toBeUndefined()
  })

  it('should delete empty nested object from array item when removeEmptyObject enabled', () => {
    const obj = {
      list: [{ child: { label: '   ' } }],
    }

    const result = trimObject(obj, {
      removeEmptyString: true,
      removeEmptyObject: true,
    })

    expect(result.list).toBeUndefined()
  })
})

describe('convertDataToParams', () => {
  it('should convert object to params', () => {
    const params = convertDataToParams({
      name: 'john',
      age: 20,
    })

    expect(params.get('name')).toBe('john')
    expect(params.get('age')).toBe('20')
  })

  it('should support array values', () => {
    const params = convertDataToParams({
      tag: ['a', 'b'],
    })

    expect(params.getAll('tag')).toEqual(['a', 'b'])
  })

  it('should ignore undefined and null', () => {
    const params = convertDataToParams({
      a: undefined,
      b: null,
      c: 'ok',
    })

    expect(params.get('c')).toBe('ok')
    expect(params.get('a')).toBeNull()
  })

  it('should stringify boolean values', () => {
    const params = convertDataToParams({
      enabled: true,
    })

    expect(params.get('enabled')).toBe('true')
  })
})

describe('decodeJwtPayloadWithoutVerification', () => {
  function createToken(payload: Record<string, unknown>) {
    const base64 = Buffer.from(JSON.stringify(payload))
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    return `header.${base64}.signature`
  }

  it('should decode valid jwt payload', () => {
    const token = createToken({ user: 'john', role: 'admin' })

    const result = decodeJwtPayloadWithoutVerification(token) as {
      user: string
      role: string
    }

    expect(result.user).toBe('john')
    expect(result.role).toBe('admin')
  })

  it('should return null for invalid token', () => {
    expect(decodeJwtPayloadWithoutVerification('invalid.token')).toBeNull()
  })

  it('should return null for empty or missing payload segment', () => {
    expect(decodeJwtPayloadWithoutVerification('')).toBeNull()
    expect(decodeJwtPayloadWithoutVerification('onlyone')).toBeNull()
  })
})
