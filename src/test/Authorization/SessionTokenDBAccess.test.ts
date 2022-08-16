import { SessionTokenDBAccess } from '../../app/Authorization/SessionTokenDBAccess'
import * as Nedb from 'nedb'
import { rejects } from 'assert'
jest.mock('nedb')

// Testing with callback functions

describe('SessionTokenDBAccess', () => {
  let sessionTokenDBAccess: SessionTokenDBAccess

  const nedbMock = {
    loadDatabase: jest.fn(),
    find: jest.fn(),
    insert: jest.fn()
  }

  beforeEach(() => {
    sessionTokenDBAccess = new SessionTokenDBAccess(nedbMock)
    expect(nedbMock.loadDatabase).toBeCalledTimes(1)
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const sessionToken = {
    userName: 'someUser',
    accessRights: [1,2,3],
    valid: true,
    tokenId: '',
    expirationTime: new Date(60 * 60 * 1000)
  }

  test('store session without error', async() => {
    nedbMock.insert.mockImplementationOnce((some: any, cb: any) => {
      cb()
    })

    await sessionTokenDBAccess.storeSessionToken(sessionToken)
    expect(nedbMock.insert).toBeCalledWith(sessionToken, expect.any(Function))
  })

  test('store session with error', async () => {
    nedbMock.insert.mockImplementationOnce(
      (some: any, cb: any) => {
        cb(new Error('something went wrong'))
      }
    )

    expect(sessionTokenDBAccess.storeSessionToken(sessionToken))
      .rejects
      .toThrow('something went wrong')
    expect(nedbMock.insert).toBeCalledWith(sessionToken, expect.any(Function))
  })

})