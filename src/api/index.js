import axios from 'axios'
import { ElMessage } from 'element-plus'

const service = axios.create({
  baseURL: '/api',
  timeout: 20000 // 20秒
})

service.interceptors.request.use(
  config => {
    return config
  },
  error => Promise.reject(error)
)

service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return res
    } else {
      console.error('API Error:', res)
      ElMessage.error(res.code+" "+res.msg || 'Error')
      return Promise.reject(new Error(res.msg || 'Error'))
    }
  },
  error => {
    if (error.code === 'ECONNABORTED' && error.message && error.message.includes('timeout')) {
      ElMessage.error('timeout error, please try again later')
    } else {
      ElMessage.error('Request failed')
    }
    return Promise.reject(error)
  }
)

export default service
