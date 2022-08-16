import { LoginHandler } from "../../app/Handlers/LoginHandler";
import { Server } from "../../app/Server/Server";
import { Authorizer } from "../../app/Authorization/Authorizer";

jest.mock('../../app/Handlers/LoginHandler')
jest.mock('../../app/Authorization/Authorizer')

const requestMock = {
  url: ''
};
const responseMock = {
  end: jest.fn()
};
const listenMock = {
  listen: jest.fn()
};

jest.mock('http', () => ({
  createServer: (cb: any) => {
    cb(requestMock, responseMock)
    return listenMock;
  }
}))

describe('Server test utils', () => {
  test('should create server in port 8080', () => {
    new Server().startServer()
    expect(listenMock.listen).toBeCalled()
    expect(responseMock.end).toBeCalled()
  })

  test('should handle login requests', () => {
    requestMock.url = 'http://localhost:8080/login'
    new Server().startServer()
    const handleRequestSpy = jest.spyOn(LoginHandler.prototype, 'handleRequest')
    expect(handleRequestSpy).toBeCalled()
    expect(LoginHandler).toBeCalledWith(requestMock, responseMock, expect.any(Authorizer))
  })
})