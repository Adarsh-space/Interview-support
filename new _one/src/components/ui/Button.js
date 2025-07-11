import React from 'react';
import { cn } from '../../utils/cn';

const Button = React.forwardRef(({
    children,
    variant = 'default',
    size = 'default',
    className,
    disabled = false,
    loading = false,
    icon,
    iconPosition = 'left',
    ...props
}, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
        gradient: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700',
        success: 'bg-green-600 text-white hover:bg-green-700',
        warning: 'bg-yellow-600 text-white hover:bg-yellow-700'
    };

    const sizes = {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10'
    };

    const classes = cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
    );

    const renderIcon = () => {
        if (!icon) return null;

        const iconElement = React.cloneElement(icon, {
            className: cn(
                'inline-block',
                size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
                iconPosition === 'right' ? 'ml-2' : 'mr-2'
            )
        });

        return iconElement;
    };

    return (
        <button
            ref={ref}
            className={classes}
            disabled={disabled || loading}
            {...props}
        >
            {loading && (
                <svg
                    className={cn(
                        'animate-spin',
                        size === 'sm' ? 'w-4 h-4' : 'w-5 h-5',
                        iconPosition === 'right' ? 'ml-2' : 'mr-2'
                    )}
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
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            )}

            {!loading && iconPosition === 'left' && renderIcon()}

            {children}

            {!loading && iconPosition === 'right' && renderIcon()}
        </button>
    );
});

Button.displayName = 'Button';

export default Button; 