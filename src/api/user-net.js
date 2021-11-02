import { request } from "./request";

export function getUserMessage() {
  return request({
    url: '/user/message',
    method: 'get',
  })
}

export function userRecordTieba(tiebaId) {
  return request({
    url: `/user/${tiebaId}/record`,
    method: 'post',
  })
}

export function getRecordList() {
  return request({
    url: `/user/recordlist`,
    method: 'get',
  })
}

export function isLogin() {
  return request({
    url: `/user/islogin`,
    method: 'get',
  })
}

export function getUserDetail(userId) {
  return request({
    url: `/user/${userId}/detail`,
    method: 'get',
  })
}