import { LoginHandler } from "../../app/Handlers/LoginHandler"
import { HTTP_CODES, HTTP_METHODS, SessionToken } from "../../app/Models/ServerModels"
import { Utils } from "../../app/Utils/Utils"

describe('LoginHandler test suite', () => {
  let loginHandler: LoginHandler

  const requestMock = {
    method: ''
  }
  const responseMock = {
    writeHead: jest.fn(),
    write: jest.fn(),
    statusCode: 0,
  }
  const authorizeMock = {
    generateToken: jest.fn()
  }
  const getRequestBodyMock = jest.fn()

  beforeEach(() => {
    loginHandler = new LoginHandler(
      requestMock as any,
      responseMock as any,
      authorizeMock as any
    )
    Utils.getRequestBody = getRequestBodyMock
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  const sessionToken: SessionToken = {
    tokenId: 'someTokenId',
    userName: 'someUserName',
    valid: true,
    expirationTime: new Date(),
    accessRights: [1,2,3]
  }

  test('options request', async () => {
    requestMock.method = HTTP_METHODS.OPTIONS
    await loginHandler.handleRequest()
    expect(responseMock.writeHead).toBeCalledWith(HTTP_CODES.OK)
  })

  test('not handle http method', async () => {
    requestMock.method = 'somerandommethod'
    await loginHandler.handleRequest()
    expect(responseMock.writeHead).not.toHaveBeenCalled()
  })

  test('post request with valid login', async () => {
    requestMock.method = HTTP_METHODS.POST
    getRequestBodyMock.mockReturnValueOnce({
      username: 'someUserName',
      password: 'password'
    })
    authorizeMock.generateToken.mockReturnValueOnce(sessionToken)
    await loginHandler.handleRequest()

    expect(responseMock.statusCode).toBe(HTTP_CODES.CREATED)
    expect(responseMock.writeHead).toBeCalledWith(
      HTTP_CODES.CREATED, { 'Content-Type': 'application/json'}
    )
    expect(responseMock.write).toBeCalledWith(JSON.stringify(sessionToken))
  })

})