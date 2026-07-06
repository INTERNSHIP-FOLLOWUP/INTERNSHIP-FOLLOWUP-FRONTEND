import axios from 'axios'
import router from '../router'

// Create Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 10000,
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    const status = error.response?.status

    if (status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token')
      router.push('/login')
    }

    if (status === 403) {
      router.push('/forbidden')
    }

    if (status === 500) {
      console.error('Server error. Please try again later.')
    }

    return Promise.reject(error)
  }
)

export default api