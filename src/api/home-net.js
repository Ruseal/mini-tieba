import { request } from "./request";

export function getArticleList(offset, size) {
  return request({
    url: '/article',
    method: 'get',
    params: {
      offset,
      size
    }
  })
}