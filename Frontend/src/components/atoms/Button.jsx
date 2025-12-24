import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    className,
    isLoading = false,
    disabled,
    type = 'button',
    ...props
}) {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-bold transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
        primary: 'bg-primary text-slate-900 hover:bg-primary-dark hover:text-white shadow-lg shadow-primary/20',
        secondary: 'bg-surface-light dark:bg-surface-dark border border-gray-200 dark:border-gray-700 text-text-main dark:text-white hover:border-primary dark:hover:border-primary',
        ghost: 'bg-transparent text-text-secondary hover:bg-primary/10 hover:text-primary',
        danger: 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400',
    };

    const sizes = {
        sm: 'h-8 px-3 text-xs',
        md: 'h-10 px-4 text-sm',
        lg: 'h-12 px-6 text-base',
        xl: 'h-14 px-8 text-lg',
    };

    return (
        <button
            type={type}
            className={twMerge(
                baseStyles,
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading || disabled}
            {...props}
        >
            {isLoading ? (
                <span className="material-symbols-outlined animate-spin text-sm mr-2">progress_activity</span>
            ) : null}
            {children}
        </button>
    );
}

Button.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'secondary', 'ghost', 'danger']),
    size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    disabled: PropTypes.bool,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
};
