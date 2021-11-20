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

export function focusUser(focusId) {
  return request({
    url: `/user/focus`,
    method: 'post',
    data: {
      focusId
    }
  })
}

export function unFocusUser(focusId) {
  return request({
    url: `/user/unfocus`,
    method: 'delete',
    data: {
      focusId
    }
  })
}

export function getUserDetail(userId) {
  return request({
    url: `/user/${userId}/detail`,
    method: 'get',
  })
}

export function getUserDetailList(userId) {
  return request({
    url: `/user/${userId}/labellist`,
    method: 'get',
  })
}

export function uploadUserAvatar(data) {
  return request({
    url: `/upload/userAvatar`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}

export function updateUser(data) {
  return request({
    url: `/user/update`,
    method: 'patch',
    data
  })
}

export function getUserStarList() {
  return request({
    url: `/user/star`,
    method: 'get'
  })
}

export function recordHistory(articleId) {
  return request({
    url: `/user/history`,
    method: 'post',
    data:{
      articleId
    }
  })
}

export function getRecordHistory() {
  return request({
    url: `/user/history`,
    method: 'get',
  })
}

export function clearUserHistory() {
  return request({
    url: `/user/history`,
    method: 'delete',
  })
}

export function openMember() {
  return request({
    url: `/user/member`,
    method: 'patch',
  })
}