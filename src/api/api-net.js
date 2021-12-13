import { request } from "./request";

export function getUserReply() {
  return request({
    url: `/comment/userreply`,
    method: 'get'
  })
}

export function getBadge() {
  return request({
    url: `/comment/badge`,
    method: 'get',
  })
}

export function clearBadge(params) {
  return request({
    url: `/comment/clear/badge`,
    method: 'patch',
    params
  })
}