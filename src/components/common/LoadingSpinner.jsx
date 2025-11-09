import React from 'react';

/**
 * Loading Spinner Component
 * A reusable loading spinner with customizable text and size
 */
const LoadingSpinner = ({
    text = "Loading...",
    size = "default",
    className = "",
    style = {}
}) => {
    const sizeClass = {
        small: "spinner-border-sm",
        default: "",
        large: "spinner-border-lg"
    }[size];

    const defaultStyle = { minHeight: '200px' };

    return (
        <div
            className={`d-flex justify-content-center align-items-center ${className}`}
            style={{ ...defaultStyle, ...style }}
        >
            <div className={`spinner-border ${sizeClass}`} role="status">
                <span className="visually-hidden">{text}</span>
            </div>
            {text !== "Loading..." && (
                <span className="ms-2">{text}</span>
            )}
        </div>
    );
};

export default LoadingSpinner;
