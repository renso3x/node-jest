import { Utils } from '../app/Utils'

describe('Utils test suites', () => {
  test('first test', () => {
    const utils = Utils.toUpperCase('abc')

    expect(utils).toEqual('ABC')
  })

  test('parse simple ULR', () => {
    const utils = Utils.parseUrl('http://localhost:8000/login')
    expect(utils.href).toBe('http://localhost:8000/login')
    expect(utils.port).toBe('8000')
    expect(utils.protocol).toBe('http:')
    expect(utils.query).toEqual({})
  })

  test('parse URL with query', () => {
    const utils = Utils.parseUrl('http://localhost:8000/login?user=user&password=pass')
    const expectedQuery = {
      user: 'user',
      password: 'pass'
    }
    expect(utils.query).toEqual(expectedQuery)

  })

  // Test suites for errors

  test('invalid URL normal function', () => {
    function expectedError() {
      Utils.parseUrl('')
    }
    expect(expectedError).toThrow('Empty Url')
  })
  test('invalid URL with arrow function', () => {

    expect(() => {
      Utils.parseUrl('')
    }).toThrow('Empty Url')
  })

  test('invalid URL with try catch', () => {
    try {
      Utils.parseUrl('')
    } catch(error) {
      expect(error).toBeInstanceOf(Error)
      expect(error).toHaveProperty('message', 'Empty Url')
    }
  })
})