import './StatusBadge.css'

interface StatusBadgeProps {
  status: 'Pending' | 'Processing' | 'Resolved' | 'Solved'
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case 'Pending':
        return 'status-pending'
      case 'Processing':
        return 'status-processing'
      case 'Resolved':
      case 'Solved':
        return 'status-resolved'
      default:
        return 'status-pending'
    }
  }

  return <span className={`status-badge ${getStatusClass(status)}`}>{status}</span>
}

export default StatusBadge

