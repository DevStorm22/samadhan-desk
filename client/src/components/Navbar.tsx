import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import './Navbar.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = (): void => {
    logout()
    navigate('/')
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">📋</span>
          <span className="logo-text">Samadhan Desk</span>
        </Link>

        <div className="navbar-menu">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/departments" className="nav-link">
            Departments
          </Link>

          {isAuthenticated ? (
            <>
              {user?.role === 'admin' ? (
                <Link to="/admin/dashboard" className="nav-link">
                  Admin Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/dashboard" className="nav-link">
                    Dashboard
                  </Link>
                  <Link to="/complaints" className="nav-link">
                    My Complaints
                  </Link>
                  <Link to="/complaints/new" className="nav-link btn-primary">
                    File Complaint
                  </Link>
                </>
              )}
              <div className="user-menu">
                <span className="user-name">{user?.name}</span>
                <button onClick={handleLogout} className="btn-logout">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link btn-primary">
                Register
              </Link>
              <Link to="/admin/login" className="nav-link btn-admin">
                🔐 Admin Login
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar

