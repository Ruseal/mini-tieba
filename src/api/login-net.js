import { request } from "./request";

export function userRegister(username, password) {
  return request({
    url: '/user/register',
    method: 'post',
    data: {
      username,
      password,
    }
  })
}

export function userLogin(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password,
    }
  })
}

export function routerTokenAuth() {
  return request({
    url: '/user/token',
    method: 'post',
  })
}

export function exitLogin() {
  return request({
    url: '/user/exitLogin',
    method: 'get',
  })
}

