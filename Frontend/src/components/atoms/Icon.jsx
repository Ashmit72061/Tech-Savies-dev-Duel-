import PropTypes from 'prop-types';
import { twMerge } from 'tailwind-merge';

export default function Icon({
    name,
    size = 24,
    className,
    filled = false,
    ...props
}) {
    return (
        <span
            className={twMerge("material-symbols-outlined select-none", className)}
            style={{
                fontSize: `${size}px`,
                fontVariationSettings: filled ? "'FILL' 1" : "'FILL' 0"
            }}
            {...props}
        >
            {name}
        </span>
    );
}

Icon.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.number,
    className: PropTypes.string,
    filled: PropTypes.bool,
};
