import { request } from "./request";

export function getArticleList(params) {
  return request({
    url: '/article',
    method: 'get',
    params
  })
}

export function articleLike(articleId) {
  return request({
    url: `/article/${articleId}/like`,
    method: 'post'
  })
}

export function articleUnLike(articleId) {
  return request({
    url: `/article/${articleId}/unlike`,
    method: 'delete'
  })
}