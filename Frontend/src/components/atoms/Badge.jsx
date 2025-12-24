import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function Badge({
    children,
    variant = 'neutral',
    className
}) {
    const variants = {
        primary: 'bg-primary/20 text-green-800 dark:text-primary',
        success: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
        warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
        danger: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
        neutral: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
    };

    return (
        <span className={twMerge(
            "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider",
            variants[variant],
            className
        )}>
            {children}
        </span>
    );
}

Badge.propTypes = {
    children: PropTypes.node.isRequired,
    variant: PropTypes.oneOf(['primary', 'success', 'warning', 'danger', 'neutral']),
    className: PropTypes.string,
};
