import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { RegisterData } from '../types'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import './Auth.css'

const AdminRegister = () => {
  const [formData, setFormData] = useState<RegisterData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
  })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)

    // Note: In a real app, admin registration would require special privileges
    // For now, we'll register and then manually set role to admin via backend
    // Or you can create a separate admin registration endpoint
    const result = await register(formData)

    if (result.success) {
      // Note: This assumes the backend sets role to 'admin' for admin registration
      // You may need to modify the backend to accept role in registration
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        setError('Registration successful, but admin role not assigned. Please contact system administrator.')
      }
    } else {
      setError(result.message || 'Registration failed')
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h1 className="auth-title">Admin Registration</h1>
        <p className="auth-subtitle">Create an admin account</p>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Full Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter your full name"
          />
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
          />
          <Input
            label="Phone"
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter your 10-digit phone number"
            maxLength={10}
          />
          <Input
            label="Address"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
            placeholder="Enter your address"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Create a password"
          />
          <Button type="submit" variant="primary" disabled={loading} className="auth-button">
            {loading ? 'Creating account...' : 'Register as Admin'}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/admin/login">Admin Login</Link>
        </p>
      </Card>
    </div>
  )
}

export default AdminRegister

