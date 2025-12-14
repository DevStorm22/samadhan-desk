import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { complaintsAPI } from '../services/api'
import { Complaint } from '../types'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import './Dashboard.css'

const Dashboard = () => {
  const { user } = useAuth()
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchComplaints()
  }, [])

  const fetchComplaints = async (): Promise<void> => {
    try {
      const response = await complaintsAPI.getMyComplaints()
      setComplaints(response.data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusCount = (status: string): number => {
    return complaints.filter((c) => c.status === status).length
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <div>
            <h1 className="page-title">Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.name}!</p>
          </div>
          <Link to="/complaints/new">
            <Button variant="primary">File New Complaint</Button>
          </Link>
        </div>

        <div className="stats-grid">
          <Card className="stat-card">
            <div className="stat-value">{complaints.length}</div>
            <div className="stat-label">Total Complaints</div>
          </Card>
          <Card className="stat-card stat-pending">
            <div className="stat-value">{getStatusCount('Pending')}</div>
            <div className="stat-label">Pending</div>
          </Card>
          <Card className="stat-card stat-processing">
            <div className="stat-value">{getStatusCount('Processing')}</div>
            <div className="stat-label">Processing</div>
          </Card>
          <Card className="stat-card stat-resolved">
            <div className="stat-value">{getStatusCount('Resolved') + getStatusCount('Solved')}</div>
            <div className="stat-label">Resolved</div>
          </Card>
        </div>

        <div className="recent-complaints">
          <h2 className="section-title">Recent Complaints</h2>
          {complaints.length === 0 ? (
            <Card>
              <div className="empty-state">
                <p>No complaints yet. File your first complaint to get started!</p>
                <Link to="/complaints/new">
                  <Button variant="primary">File Complaint</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="complaints-list">
              {complaints.slice(0, 5).map((complaint) => (
                <Card key={complaint._id} className="complaint-item">
                  <div className="complaint-header">
                    <h3 className="complaint-type">{complaint.complaintType}</h3>
                    <StatusBadge status={complaint.status} />
                  </div>
                  <p className="complaint-description">{complaint.description}</p>
                  <div className="complaint-footer">
                    <span className="complaint-location">📍 {complaint.location}</span>
                    <Link to={`/complaints/${complaint._id}`}>
                      <Button variant="outline" className="btn-sm">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </Card>
              ))}
              {complaints.length > 5 && (
                <Link to="/complaints" className="view-all">
                  View All Complaints →
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard

