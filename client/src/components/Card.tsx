import { ReactNode, HTMLAttributes } from 'react'
import './Card.css'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  className?: string
  onClick?: () => void
}

const Card = ({ children, className = '', onClick, ...props }: CardProps) => {
  return (
    <div className={`card ${className}`} onClick={onClick} {...props}>
      {children}
    </div>
  )
}

export default Card

