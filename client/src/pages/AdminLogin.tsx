import { useState, FormEvent, ChangeEvent } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Input from '../components/Input'
import Button from '../components/Button'
import Card from '../components/Card'
import './Auth.css'

const AdminLogin = () => {
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await login(formData.email, formData.password)

      if (result.success) {
        // Check if user is admin
        const user = JSON.parse(localStorage.getItem('user') || '{}')
        if (user.role === 'admin') {
          navigate('/admin/dashboard')
        } else {
          setError(`Access denied. Your account role is "${user.role}". Admin privileges required.`)
          localStorage.removeItem('token')
          localStorage.removeItem('user')
        }
      } else {
        setError(result.message || 'Invalid email or password. Please check your credentials.')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred during login. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <h1 className="auth-title">Admin Login</h1>
        <p className="auth-subtitle">Login to access admin dashboard</p>

        {error && <div className="error-alert">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your admin email"
          />
          <Input
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            placeholder="Enter your password"
          />
          <Button type="submit" variant="primary" disabled={loading} className="auth-button">
            {loading ? 'Logging in...' : 'Login as Admin'}
          </Button>
        </form>

        <p className="auth-footer">
          Not an admin? <Link to="/login">User Login</Link>
        </p>
        <p className="auth-footer" style={{ marginTop: '10px', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Need to create an admin account? <Link to="/register">Register as Admin</Link>
        </p>
      </Card>
    </div>
  )
}

export default AdminLogin

