import { SelectHTMLAttributes } from 'react'
import './Select.css'

interface SelectOption {
  value: string
  label: string
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
  error?: string
  options: SelectOption[]
  placeholder?: string
  required?: boolean
}

const Select = ({
  label,
  value,
  onChange,
  error,
  options,
  placeholder,
  required,
  ...props
}: SelectProps) => {
  return (
    <div className="select-group">
      {label && (
        <label className="select-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      <select
        className={`select ${error ? 'select-error' : ''}`}
        value={value}
        onChange={onChange}
        required={required}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="error-message">{error}</span>}
    </div>
  )
}

export default Select

