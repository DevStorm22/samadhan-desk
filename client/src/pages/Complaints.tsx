import { useEffect, useState, ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { complaintsAPI } from '../services/api'
import { Complaint } from '../types'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import Select from '../components/Select'
import './Complaints.css'

const Complaints = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [filteredComplaints, setFilteredComplaints] = useState<Complaint[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchComplaints()
  }, [])

  useEffect(() => {
    filterComplaints()
  }, [complaints, statusFilter])

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

  const filterComplaints = (): void => {
    if (statusFilter === 'all') {
      setFilteredComplaints(complaints)
    } else {
      setFilteredComplaints(complaints.filter((c) => c.status === statusFilter))
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="complaints-page">
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">My Complaints</h1>
            <p className="page-subtitle">View and manage all your filed complaints</p>
          </div>
          <Link to="/complaints/new">
            <Button variant="primary">File New Complaint</Button>
          </Link>
        </div>

        <div className="filters">
          <Select
            label="Filter by Status"
            value={statusFilter}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
            options={[
              { value: 'all', label: 'All Complaints' },
              { value: 'Pending', label: 'Pending' },
              { value: 'Processing', label: 'Processing' },
              { value: 'Resolved', label: 'Resolved' },
              { value: 'Solved', label: 'Solved' },
            ]}
            className="filter-select"
          />
        </div>

        {filteredComplaints.length === 0 ? (
          <Card>
            <div className="empty-state">
              <p>No complaints found.</p>
              <Link to="/complaints/new">
                <Button variant="primary">File Your First Complaint</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <div className="complaints-grid">
            {filteredComplaints.map((complaint) => (
              <Card key={complaint._id} className="complaint-card">
                <div className="complaint-card-header">
                  <h3 className="complaint-type">{complaint.complaintType}</h3>
                  <StatusBadge status={complaint.status} />
                </div>
                <p className="complaint-description">{complaint.description}</p>
                <div className="complaint-meta">
                  <span className="complaint-location">📍 {complaint.location}</span>
                  <span className="complaint-date">📅 {formatDate(complaint.submissionDate)}</span>
                </div>
                <Link to={`/complaints/${complaint._id}`} className="complaint-link">
                  <Button variant="outline" className="btn-full">
                    View Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Complaints

