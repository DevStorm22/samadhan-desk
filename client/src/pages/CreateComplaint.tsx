import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { complaintsAPI, departmentsAPI } from '../services/api'
import { Department, ComplaintFormData } from '../types'
import Card from '../components/Card'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import Button from '../components/Button'
import './CreateComplaint.css'

const CreateComplaint = () => {
  const [formData, setFormData] = useState<ComplaintFormData>({
    complaintType: '',
    description: '',
    location: '',
    department: '',
  })
  const [departments, setDepartments] = useState<Array<{ value: string; label: string }>>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    fetchDepartments()
  }, [])

  const fetchDepartments = async (): Promise<void> => {
    try {
      const response = await departmentsAPI.getAll()
      setDepartments(
        response.data.map((dept: Department) => ({
          value: dept._id,
          label: dept.deptName,
        }))
      )
    } catch (error) {
      console.error('Error fetching departments:', error)
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('')
  }

  const complaintTypes = [
    { value: 'Sanitation & Cleanliness', label: 'Sanitation & Cleanliness' },
    { value: 'Water Supply', label: 'Water Supply' },
    { value: 'Electricity Issues', label: 'Electricity Issues' },
    { value: 'Roads & Infrastructure', label: 'Roads & Infrastructure' },
    { value: 'Public Safety & Security', label: 'Public Safety & Security' },
    { value: 'Environmental Issues', label: 'Environmental Issues' },
    { value: 'Government Service Issues', label: 'Government Service Issues' },
    { value: 'Health & Hygiene', label: 'Health & Hygiene' },
    { value: 'Transport & Traffic', label: 'Transport & Traffic' },
    { value: 'Other', label: 'Other' },
  ]

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const data = {
        ...formData,
        department: formData.department || undefined,
      }
      await complaintsAPI.create(data)
      navigate('/complaints')
    } catch (error: any) {
      setError(error.response?.data?.message || 'Failed to create complaint')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-complaint-page">
      <div className="container">
        <h1 className="page-title">File a Complaint</h1>
        <p className="page-subtitle">Report an issue and help improve our community</p>

        <Card className="form-card">
          {error && <div className="error-alert">{error}</div>}

          <form onSubmit={handleSubmit} className="complaint-form">
            <Select
              label="Complaint Type"
              name="complaintType"
              value={formData.complaintType}
              onChange={handleChange}
              options={complaintTypes}
              placeholder="Select complaint type"
              required
            />

            <Select
              label="Department (Optional)"
              name="department"
              value={formData.department || ''}
              onChange={handleChange}
              options={departments}
              placeholder="Select department (if applicable)"
            />

            <Input
              label="Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Enter the location of the issue"
              required
            />

            <Textarea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the issue in detail..."
              required
              rows={6}
            />

            <div className="form-actions">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/complaints')}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? 'Submitting...' : 'Submit Complaint'}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}

export default CreateComplaint

