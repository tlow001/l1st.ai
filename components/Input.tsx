import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-label uppercase text-gray-700 mb-2">
            {label}
            {props.required && <span className="text-gray-500 ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={`w-full h-10 px-3 text-body border border-gray-300 rounded-md bg-white text-gray-900 placeholder:text-gray-500 
            focus:outline-none focus:ring-2 focus:ring-primary-purple focus:border-primary-purple focus:shadow-focus
            transition-all duration-standard
            disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-100 ${
            error ? 'border-error-red focus:ring-error-red focus:border-error-red' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="mt-1 text-body-sm text-error-red">{error}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
