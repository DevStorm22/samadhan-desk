import { TextareaHTMLAttributes } from 'react'
import './Textarea.css'

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  required?: boolean
  rows?: number
}

const Textarea = ({
  label,
  value,
  onChange,
  error,
  placeholder,
  required,
  rows = 4,
  ...props
}: TextareaProps) => {
  return (
    <div className="textarea-group">
      {label && (
        <label className="textarea-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        className={`textarea ${error ? 'textarea-error' : ''}`}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        rows={rows}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default Textarea

