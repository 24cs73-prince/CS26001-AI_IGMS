import { forwardRef } from 'react';
import { cn } from '../../utils/cn';
import Loader from './Loader';

/**
 * Reusable Button.
 * variants: primary | secondary | outline | ghost | subtle | danger | success
 * sizes:    sm | md | lg | icon
 */
const VARIANTS = {
  primary:
    'bg-primary text-white shadow-soft hover:bg-primary-700 active:bg-primary-800',
  secondary:
    'bg-secondary text-white shadow-soft hover:bg-secondary-700 active:bg-secondary-700',
  success: 'bg-accent text-white shadow-soft hover:bg-accent-600',
  danger: 'bg-danger text-white shadow-soft hover:bg-danger-600',
  outline:
    'bg-white text-ink border border-hairline hover:bg-canvas hover:border-slate-300',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-ink',
  subtle: 'bg-primary/10 text-primary hover:bg-primary/15',
};

const SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5 rounded-lg',
  md: 'h-10 px-4 text-sm gap-2 rounded-xl',
  lg: 'h-11 px-5 text-sm gap-2 rounded-xl',
  icon: 'h-10 w-10 rounded-xl justify-center',
};

const Button = forwardRef(function Button(
  {
    as: Comp = 'button',
    variant = 'primary',
    size = 'md',
    icon: Icon,
    iconRight: IconRight,
    loading = false,
    disabled = false,
    className,
    children,
    ...props
  },
  ref
) {
  return (
    <Comp
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium transition-all duration-150 focus-ring select-none',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <Loader size="xs" tone={variant === 'outline' || variant === 'ghost' ? 'primary' : 'white'} />
      ) : (
        Icon && <Icon className="h-4 w-4 shrink-0" aria-hidden />
      )}
      {size !== 'icon' && children}
      {IconRight && !loading && <IconRight className="h-4 w-4 shrink-0" aria-hidden />}
    </Comp>
  );
});

export default Button;
