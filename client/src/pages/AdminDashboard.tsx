import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { complaintsAPI, authAPI, departmentsAPI } from '../services/api'
import { Complaint, User, Department } from '../types'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import Select from '../components/Select'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import './AdminDashboard.css'

const AdminDashboard = () => {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<'complaints' | 'users' | 'departments'>('complaints')
  const [complaints, setComplaints] = useState<Complaint[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [showDepartmentForm, setShowDepartmentForm] = useState<boolean>(false)
  const [departmentForm, setDepartmentForm] = useState({
    deptName: '',
    deptHead: '',
    email: '',
    phone: '',
    description: '',
  })
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (activeTab === 'complaints') {
      fetchComplaints()
    } else if (activeTab === 'users') {
      fetchUsers()
    } else {
      fetchDepartments()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'complaints') {
      filterComplaints()
    }
  }, [complaints, statusFilter])

  const fetchComplaints = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await complaintsAPI.getAllComplaints()
      setComplaints(response.data)
    } catch (error) {
      console.error('Error fetching complaints:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await authAPI.getAllUsers()
      setUsers(response.data)
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDepartments = async (): Promise<void> => {
    try {
      setLoading(true)
      const response = await departmentsAPI.getAll()
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  const filterComplaints = (): void => {
    // Filtering is handled in render
  }

  const getFilteredComplaints = (): Complaint[] => {
    if (statusFilter === 'all') {
      return complaints
    }
    return complaints.filter((c) => c.status === statusFilter)
  }

  const handleDepartmentSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setSubmitting(true)

    try {
      await departmentsAPI.create(departmentForm)
      setShowDepartmentForm(false)
      setDepartmentForm({
        deptName: '',
        deptHead: '',
        email: '',
        phone: '',
        description: '',
      })
      fetchDepartments()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create department')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDepartmentChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    setDepartmentForm({ ...departmentForm, [e.target.name]: e.target.value })
  }

  const handleDeleteDepartment = async (id: string): Promise<void> => {
    if (!confirm('Are you sure you want to delete this department?')) {
      return
    }

    try {
      await departmentsAPI.delete(id)
      fetchDepartments()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete department')
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getStatusCount = (status: string): number => {
    return complaints.filter((c) => c.status === status).length
  }

  if (loading && complaints.length === 0 && users.length === 0 && departments.length === 0) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="container">
        <div className="admin-header">
          <div>
            <h1 className="page-title">Admin Dashboard</h1>
            <p className="page-subtitle">Welcome, {user?.name}</p>
          </div>
        </div>

        <div className="admin-tabs">
          <button
            className={`tab-button ${activeTab === 'complaints' ? 'active' : ''}`}
            onClick={() => setActiveTab('complaints')}
          >
            All Complaints ({complaints.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            All Users ({users.length})
          </button>
          <button
            className={`tab-button ${activeTab === 'departments' ? 'active' : ''}`}
            onClick={() => setActiveTab('departments')}
          >
            Departments ({departments.length})
          </button>
        </div>

        {activeTab === 'complaints' && (
          <div className="admin-content">
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

            <div className="filters-section">
              <Select
                label="Filter by Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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

            {getFilteredComplaints().length === 0 ? (
              <Card>
                <div className="empty-state">
                  <p>No complaints found.</p>
                </div>
              </Card>
            ) : (
              <div className="complaints-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Type</th>
                      <th>User</th>
                      <th>Location</th>
                      <th>Status</th>
                      <th>Date</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {getFilteredComplaints().map((complaint) => {
                      const complaintUser = typeof complaint.user === 'object' ? complaint.user : null
                      return (
                        <tr key={complaint._id}>
                          <td className="complaint-id">{complaint._id.slice(-6)}</td>
                          <td className="complaint-type-cell">{complaint.complaintType}</td>
                          <td>
                            {complaintUser ? (
                              <div className="user-info">
                                <div className="user-name">{complaintUser.name}</div>
                                <div className="user-email">{complaintUser.email}</div>
                              </div>
                            ) : (
                              'N/A'
                            )}
                          </td>
                          <td>{complaint.location}</td>
                          <td>
                            <StatusBadge status={complaint.status} />
                          </td>
                          <td>{formatDate(complaint.submissionDate)}</td>
                          <td>
                            <Button
                              variant="outline"
                              className="btn-sm"
                              onClick={() => window.location.href = `/complaints/${complaint._id}`}
                            >
                              View
                            </Button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'users' && (
          <div className="admin-content">
            {users.length === 0 ? (
              <Card>
                <div className="empty-state">
                  <p>No users found.</p>
                </div>
              </Card>
            ) : (
              <div className="users-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Address</th>
                      <th>Role</th>
                      <th>Registered</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((userItem) => (
                      <tr key={userItem._id}>
                        <td className="user-name-cell">{userItem.name}</td>
                        <td>{userItem.email}</td>
                        <td>{userItem.phone}</td>
                        <td className="address-cell">{userItem.address}</td>
                        <td>
                          <span className={`role-badge role-${userItem.role}`}>
                            {userItem.role}
                          </span>
                        </td>
                        <td>{userItem.createdAt ? formatDate(userItem.createdAt) : 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'departments' && (
          <div className="admin-content">
            <div className="departments-header">
              <h2 className="section-title">Manage Departments</h2>
              <Button
                variant="primary"
                onClick={() => setShowDepartmentForm(!showDepartmentForm)}
              >
                {showDepartmentForm ? 'Cancel' : '+ Add Department'}
              </Button>
            </div>

            {showDepartmentForm && (
              <Card className="department-form-card">
                <h3>Create New Department</h3>
                <form onSubmit={handleDepartmentSubmit} className="department-form">
                  <Input
                    label="Department Name"
                    name="deptName"
                    value={departmentForm.deptName}
                    onChange={handleDepartmentChange}
                    required
                    placeholder="Enter department name"
                  />
                  <Input
                    label="Department Head"
                    name="deptHead"
                    value={departmentForm.deptHead}
                    onChange={handleDepartmentChange}
                    required
                    placeholder="Enter department head name"
                  />
                  <Input
                    label="Email"
                    type="email"
                    name="email"
                    value={departmentForm.email}
                    onChange={handleDepartmentChange}
                    required
                    placeholder="Enter department email"
                  />
                  <Input
                    label="Phone"
                    type="tel"
                    name="phone"
                    value={departmentForm.phone}
                    onChange={handleDepartmentChange}
                    required
                    placeholder="Enter 10-digit phone number"
                    maxLength={10}
                  />
                  <Textarea
                    label="Description (Optional)"
                    name="description"
                    value={departmentForm.description}
                    onChange={handleDepartmentChange}
                    placeholder="Enter department description"
                    rows={3}
                  />
                  <div className="form-actions">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setShowDepartmentForm(false)
                        setDepartmentForm({
                          deptName: '',
                          deptHead: '',
                          email: '',
                          phone: '',
                          description: '',
                        })
                      }}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" variant="primary" disabled={submitting}>
                      {submitting ? 'Creating...' : 'Create Department'}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {departments.length === 0 ? (
              <Card>
                <div className="empty-state">
                  <p>No departments found. Create your first department!</p>
                </div>
              </Card>
            ) : (
              <div className="departments-grid">
                {departments.map((dept) => (
                  <Card key={dept._id} className="department-card">
                    <div className="department-card-header">
                      <h3 className="department-name">{dept.deptName}</h3>
                      <Button
                        variant="danger"
                        className="btn-sm"
                        onClick={() => handleDeleteDepartment(dept._id)}
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="department-info">
                      <div className="info-row">
                        <span className="info-label">Head:</span>
                        <span className="info-value">{dept.deptHead}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{dept.email}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{dept.phone}</span>
                      </div>
                      {dept.description && (
                        <p className="department-description">{dept.description}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard
