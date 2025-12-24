import PropTypes from 'prop-types';
import { clsx } from 'clsx';
import Icon from './Icon';

export default function Input({
    label,
    type = 'text',
    placeholder,
    error,
    icon,
    fullWidth = true,
    className,
    ...props
}) {
    return (
        <div className={clsx("flex flex-col gap-1.5", fullWidth && "w-full", className)}>
            {label && (
                <label className="text-sm font-bold text-text-main dark:text-gray-200">
                    {label}
                </label>
            )}

            <div className="relative group">
                {icon && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
                        <Icon name={icon} size={20} />
                    </div>
                )}

                <input
                    type={type}
                    className={clsx(
                        "block w-full rounded-lg border-2 bg-background-light dark:bg-surface-dark text-text-main dark:text-white placeholder:text-gray-400 transition-all focus:ring-0",
                        icon ? "pl-10" : "pl-4",
                        error
                            ? "border-red-500 focus:border-red-600"
                            : "border-gray-200 dark:border-gray-700 focus:border-primary",
                        "h-12"
                    )}
                    placeholder={placeholder}
                    {...props}
                />
            </div>

            {error && (
                <p className="text-xs text-red-500 font-medium flex items-center gap-1">
                    <Icon name="error" size={14} />
                    {error}
                </p>
            )}
        </div>
    );
}

Input.propTypes = {
    label: PropTypes.string,
    type: PropTypes.string,
    placeholder: PropTypes.string,
    error: PropTypes.string,
    icon: PropTypes.string,
    fullWidth: PropTypes.bool,
    className: PropTypes.string,
};
