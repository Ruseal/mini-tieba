import { request } from "./request";

export function getUserReply() {
  return request({
    url: `/comment/userreply`,
    method: 'get'
  })
}