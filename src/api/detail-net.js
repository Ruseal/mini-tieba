import { request } from "./request";

export function getDetail(articleId) {
  return request({
    url: `/article/${articleId}`,
    method: 'get'
  })
}

export function getComment(articleId, offset, size) {
  return request({
    url: '/comment',
    method: 'get',
    params: {
      articleId,
      offset,
      size
    }
  })
}

export function getReply(commentId) {
  return request({
    url: `/comment/${commentId}/reply`,
    method: 'get'
  })
}

export function publishedComment(content, articleId) {
  return request({
    url: '/comment',
    method: 'post',
    data: {
      content,
      articleId
    }
  })
}

export function uploadCommentPictrue(data, commentId) {
  return request({
    url: '/upload/commentPictrue',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data,
    params: {
      commentId
    },
  })
}

export function publishedReply(commentReplyId, content, articleId, commentId) {
  return request({
    url: `/comment/${commentReplyId}/reply`,
    method: 'post',
    data: {
      content,
      articleId,
      commentId
    }
  })
}

export function like(commentId) {
  return request({
    url: `/comment/${commentId}/like`,
    method: 'post'
  })
}

export function unlike(commentId) {
  return request({
    url: `/comment/${commentId}/unlike`,
    method: 'delete'
  })
}

export function start(articleId) {
  return request({
    url: `/article/${articleId}/start`,
    method: 'post'
  })
}

export function unstart(articleId) {
  return request({
    url: `/article/${articleId}/unstart`,
    method: 'delete'
  })
}

export function deleteComment(commentId) {
  return request({
    url: `/comment/${commentId}`,
    method: 'delete'
  })
}