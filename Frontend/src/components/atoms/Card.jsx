import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function Card({
    children,
    className,
    padding = 'p-6',
    onClick
}) {
    return (
        <div
            className={twMerge(
                "bg-surface-light dark:bg-surface-dark rounded-xl border border-gray-200 dark:border-gray-800 shadow-sm overflow-hidden",
                padding,
                onClick && "cursor-pointer hover:shadow-md transition-shadow hover:border-primary/50",
                className
            )}
            onClick={onClick}
        >
            {children}
        </div>
    );
}

Card.propTypes = {
    children: PropTypes.node.isRequired,
    className: PropTypes.string,
    padding: PropTypes.string,
    onClick: PropTypes.func,
};
