import { request } from "./request";

export function getAllTieba() {
  return request({
    url: '/tieba/all',
    method: 'get',
  })
}

export function getTiebaDeatil(tiebaId) {
  return request({
    url: `/tieba/${tiebaId}/detail`,
    method: 'get',
  })
}

export function updateSign(tiebaId, level, exp) {
  return request({
    url: `/tieba/${tiebaId}/sign`,
    method: 'patch',
    data: {
      level,
      exp
    }
  })
}

export function getArticleList(tiebaId, offset, size) {
  return request({
    url: `/tieba/${tiebaId}/article`,
    method: 'get',
    params: {
      offset,
      size
    }
  })
}

