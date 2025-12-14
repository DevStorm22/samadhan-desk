import { useEffect, useState } from 'react'
import { departmentsAPI } from '../services/api'
import { Department } from '../types'
import Card from '../components/Card'
import './Departments.css'

const Departments = () => {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async (): Promise<void> => {
    try {
      const response = await departmentsAPI.getAll()
      setDepartments(response.data)
    } catch (error) {
      console.error('Error fetching departments:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="departments-page">
      <div className="container">
        <h1 className="page-title">Departments</h1>
        <p className="page-subtitle">Browse available departments for complaint filing</p>

        {departments.length === 0 ? (
          <Card>
            <div className="empty-state">
              <p>No departments available at the moment.</p>
            </div>
          </Card>
        ) : (
          <div className="departments-grid">
            {departments.map((dept) => (
              <Card key={dept._id} className="department-card">
                <h3 className="department-name">{dept.deptName}</h3>
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
    </div>
  )
}

export default Departments

