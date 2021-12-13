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

export function createTieba(data) {
  return request({
    url: '/tieba',
    method: 'post',
    data
  })
}

export function applyAuth(tiebaId) {
  return request({
    url: `/tieba/${tiebaId}/maxauth`,
    method: 'patch',
  })
}

export function createTiebaArticle(tiebaId, text, title) {
  return request({
    url: `/article/${tiebaId}/tieba`,
    method: 'post',
    data: {
      title,
      text
    }
  })
}

export function uploadTiebaAvatar(data, tiebaId) {
  return request({
    url: `/upload/${tiebaId}/tiebaAvatar`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data,
  })
}

export function updateTiebaIntroduction(tiebaId, introduction) {
  return request({
    url: `/tieba/${tiebaId}/introduction`,
    method: 'patch',
    data: {
      introduction
    }
  })
}

export function unFocusTieba(tiebaId) {
  return request({
    url: `/tieba/${tiebaId}/unFocus`,
    method: 'delete'
  })
}

export function focusTieba(tiebaId) {
  return request({
    url: `/tieba/${tiebaId}/focus`,
    method: 'post'
  })
}

export function releaseArticle(tiebaId, title, text) {
  return request({
    url: `/article/${tiebaId}/release`,
    method: 'post',
    data: {
      title,
      text
    }
  })
}

export function getSingleArticle(articleId) {
  return request({
    url: `/tieba/${articleId}/single`,
    method: 'get'
  })
}

export function uploadArticlePicture(data, articleId) {
  return request({
    url: `/upload/articlePictrue`,
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data,
    params: {
      articleId
    }

  })
}

export function getCategoryList() {
  return request({
    url: `/tieba/category`,
    method: 'get'
  })
}

export function getBanner() {
  return request({
    url: `/tieba/swiper/banner`,
    method: 'get'
  })
}

