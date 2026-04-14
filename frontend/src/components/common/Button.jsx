import { forwardRef } from 'react';

const variants = {
  primary: 'text-white shadow-sm hover:shadow-md',
  secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 focus:ring-gray-400 shadow-sm',
  danger: 'bg-odpp-red hover:bg-red-700 text-white focus:ring-odpp-red shadow-sm hover:shadow-md',
  success: 'bg-odpp-green hover:bg-green-700 text-white focus:ring-odpp-green shadow-sm hover:shadow-md',
  warning: 'bg-odpp-amber hover:bg-amber-600 text-white focus:ring-odpp-amber shadow-sm hover:shadow-md',
  outline: 'bg-white border border-gray-300 shadow-sm',
  ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 focus:ring-gray-400',
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = forwardRef(({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  loading = false,
  type = 'button',
  onClick,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:-translate-y-0.5 active:translate-y-0';
  const variantStyle =
    variant === 'primary'
      ? {
          backgroundColor: 'var(--accent-500)',
          borderColor: 'var(--accent-500)',
          '--tw-ring-color': 'var(--ui-ring)',
        }
      : variant === 'outline'
      ? {
          color: 'var(--accent-600)',
          '--tw-ring-color': 'var(--ui-ring)',
        }
      : undefined;

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      style={variantStyle}
      {...props}
    >
      {loading && (
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 2.199.722 4.229 1.943 5.856l2.057-1.565z"
          />
        </svg>
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;
