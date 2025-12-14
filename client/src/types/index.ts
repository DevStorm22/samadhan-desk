export interface User {
  _id: string
  name: string
  email: string
  phone: string
  address: string
  role: 'citizen' | 'officer' | 'admin' | 'politician'
  createdAt?: string
  updatedAt?: string
}

export interface Complaint {
  _id: string
  user: string | User
  department?: string | Department
  complaintType:
    | 'Sanitation & Cleanliness'
    | 'Water Supply'
    | 'Electricity Issues'
    | 'Roads & Infrastructure'
    | 'Public Safety & Security'
    | 'Environmental Issues'
    | 'Government Service Issues'
    | 'Health & Hygiene'
    | 'Transport & Traffic'
    | 'Other'
  description: string
  location: string
  submissionDate: string
  status: 'Pending' | 'Processing' | 'Resolved' | 'Solved'
  attachments?: Array<{ url: string; filename: string }>
  createdAt?: string
  updatedAt?: string
}

export interface Department {
  _id: string
  deptName: string
  deptHead: string
  email: string
  phone: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface Feedback {
  _id: string
  complaint: string | Complaint
  user: string | User
  rating: number
  comment: string
  feedbackDate: string
  createdAt?: string
  updatedAt?: string
}

export interface AuthResponse {
  message: string
  token: string
  user: User
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  address: string
  role?: 'citizen' | 'politician' | 'admin'
}

export interface ComplaintFormData {
  complaintType: string
  description: string
  location: string
  department?: string
}

export interface FeedbackFormData {
  rating: string
  comment: string
}

