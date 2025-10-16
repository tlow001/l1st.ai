import { InputHTMLAttributes, forwardRef } from 'react'
import { Check } from 'lucide-react'

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: 'md' | 'lg'
  label?: string
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ size = 'md', label, className = '', ...props }, ref) => {
    const sizes = {
      md: 'w-5 h-5',
      lg: 'w-8 h-8',
    }

    const checkSizes = {
      md: 'w-3 h-3',
      lg: 'w-5 h-5',
    }

    return (
      <label className={`inline-flex items-center cursor-pointer ${className}`}>
        <div className="relative">
          <input
            ref={ref}
            type="checkbox"
            className="sr-only peer"
            {...props}
          />
          <div
            className={`${sizes[size]} border-2 border-gray-300 rounded bg-white peer-checked:bg-gray-900 peer-checked:border-gray-900 peer-focus-visible:ring-2 peer-focus-visible:ring-gray-400 peer-focus-visible:ring-offset-2 flex items-center justify-center transition-colors`}
          >
            <Check
              className={`${checkSizes[size]} text-white opacity-0 peer-checked:opacity-100 transition-opacity`}
            />
          </div>
        </div>
        {label && <span className="ml-3 text-base text-gray-900">{label}</span>}
      </label>
    )
  }
)

Checkbox.displayName = 'Checkbox'
