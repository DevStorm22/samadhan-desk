import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { RegisterData } from '../types'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import Select from '../components/Select'
import './Auth.css'
import './Register.css'

const Register = () => {
  const [userType, setUserType] = useState<'citizen' | 'politician' | 'admin'>('citizen')
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

  const handleUserTypeChange = (e: ChangeEvent<HTMLSelectElement>): void => {
    setUserType(e.target.value as 'citizen' | 'politician' | 'admin')
    setError('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const registrationData = {
      ...formData,
      role: userType,
    }

    const result = await register(registrationData)

    if (result.success) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      
      // Navigate based on user type
      if (userType === 'admin' && user.role === 'admin') {
        navigate('/admin/dashboard')
      } else {
        navigate('/dashboard')
      }
    } else {
      setError(result.message || 'Registration failed')
    }

    setLoading(false)
  }

  return (
    <div className="auth-page">
      <Card className="auth-card register-card">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Sign up to start using Samadhan Desk</p>

        <div className="user-type-selector">
          <label className="selector-label">I am a:</label>
          <Select
            value={userType}
            onChange={handleUserTypeChange}
            options={[
              { value: 'citizen', label: 'Citizen' },
              { value: 'politician', label: 'Politician' },
              { value: 'admin', label: 'Admin' },
            ]}
            className="user-type-select"
          />
        </div>

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
            {loading ? 'Creating account...' : `Register as ${userType.charAt(0).toUpperCase() + userType.slice(1)}`}
          </Button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </Card>
    </div>
  )
}

export default Register
