import { ButtonHTMLAttributes, forwardRef } from 'react'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'icon'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { variant = 'primary', size = 'md', loading = false, className = '', children, disabled, ...props },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-standard rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-purple focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'

    const variants = {
      primary: 'bg-primary-purple text-white hover:bg-primary-purple/92 active:bg-primary-purple/88 shadow-sm hover:shadow-md active:scale-[0.98] hover:scale-[1.02] relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:-translate-x-full hover:before:animate-shimmer',
      secondary: 'bg-transparent text-gray-900 border-[1.5px] border-gray-300 hover:bg-gray-50 hover:border-gray-400 active:bg-gray-100 active:scale-[0.98] hover:scale-[1.02] hover:shadow-sm',
      ghost: 'bg-transparent text-gray-900 hover:bg-gray-100 active:bg-gray-200 active:scale-[0.98]',
      icon: 'bg-transparent text-gray-700 hover:bg-gray-100 active:bg-gray-200 w-8 h-8 p-0 rounded-md active:scale-95',
    }

    const sizes = {
      sm: 'h-9 px-4 text-button',
      md: 'h-10 px-5 text-button',
      lg: 'h-12 px-6 text-button',
    }

    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        disabled={disabled || loading}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {children}
          </>
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
