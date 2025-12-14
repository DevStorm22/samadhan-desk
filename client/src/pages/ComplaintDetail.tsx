import { useState, useEffect, FormEvent, ChangeEvent } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { complaintsAPI, feedbacksAPI } from '../services/api'
import { Complaint, Feedback, FeedbackFormData } from '../types'
import Card from '../components/Card'
import StatusBadge from '../components/StatusBadge'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import Select from '../components/Select'
import './ComplaintDetail.css'

const ComplaintDetail = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState<Complaint | null>(null)
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [showFeedback, setShowFeedback] = useState<boolean>(false)
  const [feedbackData, setFeedbackData] = useState<FeedbackFormData>({ rating: '', comment: '' })
  const [submitting, setSubmitting] = useState<boolean>(false)

  useEffect(() => {
    if (id) {
      fetchComplaint()
      fetchFeedbacks()
    }
  }, [id])

  const fetchComplaint = async (): Promise<void> => {
    if (!id) return
    try {
      const response = await complaintsAPI.getById(id)
      setComplaint(response.data)
    } catch (error) {
      console.error('Error fetching complaint:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchFeedbacks = async (): Promise<void> => {
    if (!id) return
    try {
      const response = await feedbacksAPI.getByComplaint(id)
      setFeedbacks(response.data)
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
    }
  }

  const handleFeedbackSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    if (!id) return
    setSubmitting(true)

    try {
      await feedbacksAPI.create(id, {
        rating: parseInt(feedbackData.rating),
        comment: feedbackData.comment,
      })
      setShowFeedback(false)
      setFeedbackData({ rating: '', comment: '' })
      fetchFeedbacks()
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to submit feedback')
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="container">
        <Card>
          <div className="empty-state">
            <p>Complaint not found</p>
            <Button variant="primary" onClick={() => navigate('/complaints')}>
              Back to Complaints
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  const canSubmitFeedback =
    (complaint.status === 'Resolved' || complaint.status === 'Solved') && !showFeedback

  const department = typeof complaint.department === 'object' ? complaint.department : null

  return (
    <div className="complaint-detail-page">
      <div className="container">
        <Button variant="outline" onClick={() => navigate('/complaints')} className="back-button">
          ← Back to Complaints
        </Button>

        <Card className="complaint-detail-card">
          <div className="complaint-header">
            <div>
              <h1 className="complaint-title">{complaint.complaintType}</h1>
              <p className="complaint-date">Filed on {formatDate(complaint.submissionDate)}</p>
            </div>
            <StatusBadge status={complaint.status} />
          </div>

          <div className="complaint-info">
            <div className="info-item">
              <span className="info-label">Location:</span>
              <span className="info-value">📍 {complaint.location}</span>
            </div>
            {department && (
              <div className="info-item">
                <span className="info-label">Department:</span>
                <span className="info-value">{department.deptName}</span>
              </div>
            )}
          </div>

          <div className="complaint-description">
            <h3>Description</h3>
            <p>{complaint.description}</p>
          </div>

          {canSubmitFeedback && (
            <div className="feedback-section">
              <Button
                variant="primary"
                onClick={() => setShowFeedback(true)}
                className="feedback-button"
              >
                Submit Feedback
              </Button>
            </div>
          )}

          {showFeedback && (
            <Card className="feedback-form-card">
              <h3>Submit Feedback</h3>
              <form onSubmit={handleFeedbackSubmit} className="feedback-form">
                <Select
                  label="Rating"
                  name="rating"
                  value={feedbackData.rating}
                  onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    setFeedbackData({ ...feedbackData, rating: e.target.value })
                  }
                  options={[
                    { value: '1', label: '1 - Poor' },
                    { value: '2', label: '2 - Fair' },
                    { value: '3', label: '3 - Good' },
                    { value: '4', label: '4 - Very Good' },
                    { value: '5', label: '5 - Excellent' },
                  ]}
                  placeholder="Select rating"
                  required
                />
                <Textarea
                  label="Comment (Optional)"
                  name="comment"
                  value={feedbackData.comment}
                  onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                    setFeedbackData({ ...feedbackData, comment: e.target.value })
                  }
                  placeholder="Share your experience..."
                  rows={4}
                />
                <div className="feedback-actions">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowFeedback(false)
                      setFeedbackData({ rating: '', comment: '' })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Feedback'}
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {feedbacks.length > 0 && (
            <div className="feedbacks-section">
              <h3>Feedbacks ({feedbacks.length})</h3>
              <div className="feedbacks-list">
                {feedbacks.map((feedback) => {
                  const user = typeof feedback.user === 'object' ? feedback.user : null
                  return (
                    <Card key={feedback._id} className="feedback-item">
                      <div className="feedback-header">
                        <div>
                          <strong>{user?.name || 'Anonymous'}</strong>
                          <span className="feedback-date">
                            {formatDate(feedback.feedbackDate)}
                          </span>
                        </div>
                        <div className="rating">{'⭐'.repeat(feedback.rating)}</div>
                      </div>
                      {feedback.comment && <p className="feedback-comment">{feedback.comment}</p>}
                    </Card>
                  )
                })}
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ComplaintDetail

