import { bracketize_object_querystring } from '../../business.logic/index'

describe('business.logic', () => {

  test('[function] bracketize_object_querystring', () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: 4
        }
      }
    }
    const expected = '?a=1&b[c]=2&b[d][e]=3&b[d][f]=4&'
    const actual = bracketize_object_querystring(obj)
    expect(actual).toBe(expected)

    const obj2 = {
      page: {
        size: 10,
        number: 1
      }
    }
    const expected2 = 'page[size]=10&page[number]=1&'
    const actual2 = bracketize_object_querystring(obj2, '')
    expect(actual2).toBe(expected2)
  })
})
