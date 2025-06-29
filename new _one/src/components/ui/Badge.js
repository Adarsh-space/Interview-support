import React from 'react';
import { cn } from '../../utils/cn';

const Badge = React.forwardRef(({
    variant = 'default',
    className,
    children,
    ...props
}, ref) => {
    const variants = {
        default: 'bg-primary text-primary-foreground hover:bg-primary/80',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/80',
        outline: 'text-foreground border border-input hover:bg-accent hover:text-accent-foreground',
        success: 'bg-green-100 text-green-800 hover:bg-green-200',
        warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
        info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
        purple: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
        orange: 'bg-orange-100 text-orange-800 hover:bg-orange-200'
    };

    return (
        <div
            ref={ref}
            className={cn(
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
});

Badge.displayName = 'Badge';

export default Badge; 