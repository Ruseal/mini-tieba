import axios from 'axios'

export function request(config) {
  const instence = axios.create({
    baseURL: 'http://localhost:8000',
    timeout: 5000,
  })
  instence.interceptors.request.use(config => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  }, err => { })
  instence.interceptors.response.use(res => {
    console.log('服务器响应成功')
    return res.data
  }, err => console.log('服务器响应失败'))
  return instence(config)
}
