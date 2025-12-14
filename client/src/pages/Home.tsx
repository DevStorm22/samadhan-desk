import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import Button from '../components/Button'
import './Home.css'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="home">
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">Welcome to Samadhan Desk</h1>
          <p className="hero-subtitle">
            Your trusted platform for filing and tracking public complaints
          </p>
          {!isAuthenticated && (
            <div className="hero-actions">
              <Link to="/register">
                <Button variant="primary">Get Started</Button>
              </Link>
              <Link to="/login">
                <Button variant="outline">Login</Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="features">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">📝</div>
              <h3>File a Complaint</h3>
              <p>Easily submit your complaints with detailed descriptions and location information</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">👥</div>
              <h3>Track Progress</h3>
              <p>Monitor the status of your complaints in real-time from your dashboard</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">✅</div>
              <h3>Get Resolved</h3>
              <p>Receive updates when your complaint is being processed or resolved</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home

