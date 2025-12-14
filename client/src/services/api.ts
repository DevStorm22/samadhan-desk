import axios, { AxiosInstance, AxiosResponse } from 'axios'
import {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Complaint,
  Department,
  Feedback,
  ComplaintFormData,
  User,
} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
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

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login/admin login pages
      const currentPath = window.location.pathname
      if (!currentPath.includes('/login') && !currentPath.includes('/admin/login')) {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: RegisterData): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/users/register', data),
  login: (data: LoginCredentials): Promise<AxiosResponse<AuthResponse>> =>
    api.post('/users/login', data),
  getProfile: (): Promise<AxiosResponse<{ _id: string; name: string; email: string; phone: string; address: string; role: string }>> =>
    api.get('/users/profile'),
  getAllUsers: (): Promise<AxiosResponse<User[]>> =>
    api.get('/users/all'),
}

// Complaints API
export const complaintsAPI = {
  create: (data: ComplaintFormData): Promise<AxiosResponse<{ message: string; complaint: Complaint }>> =>
    api.post('/complaints', data),
  getMyComplaints: (): Promise<AxiosResponse<Complaint[]>> =>
    api.get('/complaints/my'),
  getAllComplaints: (): Promise<AxiosResponse<Complaint[]>> =>
    api.get('/complaints'),
  getById: (id: string): Promise<AxiosResponse<Complaint>> =>
    api.get(`/complaints/${id}`),
  update: (id: string, data: Partial<ComplaintFormData>): Promise<AxiosResponse<{ message: string; updatedComplaint: Complaint }>> =>
    api.put(`/complaints/${id}`, data),
  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/complaints/${id}`),
}

// Departments API
export const departmentsAPI = {
  getAll: (): Promise<AxiosResponse<Department[]>> =>
    api.get('/departments'),
  getById: (id: string): Promise<AxiosResponse<Department>> =>
    api.get(`/departments/${id}`),
  create: (data: { deptName: string; deptHead: string; email: string; phone: string; description?: string }): Promise<AxiosResponse<{ message: string; department: Department }>> =>
    api.post('/departments', data),
  update: (id: string, data: Partial<Department>): Promise<AxiosResponse<{ message: string; updatedDepartment: Department }>> =>
    api.put(`/departments/${id}`, data),
  delete: (id: string): Promise<AxiosResponse<{ message: string }>> =>
    api.delete(`/departments/${id}`),
}

// Feedbacks API
export const feedbacksAPI = {
  create: (complaintId: string, data: { rating: number; comment: string }): Promise<AxiosResponse<{ message: string; feedback: Feedback }>> =>
    api.post(`/feedbacks/${complaintId}`, data),
  getByComplaint: (complaintId: string): Promise<AxiosResponse<Feedback[]>> =>
    api.get(`/feedbacks/${complaintId}`),
}

export default api

