import { request } from "./request";

export function getSearchHistory() {
  return request({
    url: `/search/history`,
    method: 'get'
  })
}

export function getFoundHistory() {
  return request({
    url: `/search/found`,
    method: 'get'
  })
}

export function getHotSearch() {
  return request({
    url: `/search/hot`,
    method: 'get'
  })
}

export function getSearchThink(value) {
  return request({
    url: `/search/think`,
    method: 'get',
    params: {
      value
    }
  })
}

export function getSearchList(value) {
  return request({
    url: `/search/list`,
    method: 'get',
    params: {
      value
    }
  })
}

export function getSearchArticleList(value, offset, size) {
  return request({
    url: `/search/list/article`,
    method: 'get',
    params: {
      value,
      offset,
      size
    }
  })
}

export function saveHistory(value) {
  return request({
    url: `/search/save`,
    method: 'post',
    data: {
      value
    }
  })
}

export function addHistoryCount(value) {
  return request({
    url: `/search/count`,
    method: 'patch',
    data: {
      value
    }
  })
}

export function clearSearchHistory() {
  return request({
    url: `/search/clear`,
    method: 'delete'
  })
}