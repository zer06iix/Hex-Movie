/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Dynamic-button.css';

const DynamicButton = ({
    children,
    onClick,
    to,
    style: overrideStyles,
    className,
    disabled
}) => {
    const [ripples, setRipples] = useState([]);
    const buttonRef = useRef(null);
    const minButtonWidthForRipple = 130;

    const handleClick = (e) => {
        if (disabled) return;

        // Trigger ripple effect
        const rect = buttonRef.current.getBoundingClientRect();
        let size = Math.max(rect.width, rect.height);

        // Apply the minimum size for buttons smaller than minButtonWidthForRipple
        if (rect.width < minButtonWidthForRipple) {
            size = Math.max(minButtonWidthForRipple, rect.height); // Ensure it's at least minButtonWidthForRipple or the button's height
        }

        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;

        const newRipple = {
            id: Date.now(),
            x,
            y,
            size
        };

        setRipples((prevRipples) => [...prevRipples, newRipple]);

        // Execute the onClick handler if it's a regular button
        if (!to && onClick) onClick(e);
    };

    const handleRippleEnd = (id) => {
        setRipples((prevRipples) => prevRipples.filter((ripple) => ripple.id !== id));
    };

    // Combine override styles with potentially existing className styles
    const combinedStyles = overrideStyles || {};

    // Determine the button element based on the presence of href(to)
    const ButtonElement = to ? Link : 'button';

    return (
        <ButtonElement
            ref={buttonRef}
            className={`dynamic-button ${className || ''}`}
            style={combinedStyles}
            onClick={handleClick}
            to={to}
            disabled={disabled}
        >
            {children}
            {ripples.map((ripple) => (
                <span
                    key={ripple.id}
                    className="ripple"
                    style={{
                        width: ripple.size,
                        height: ripple.size,
                        top: ripple.y,
                        left: ripple.x
                    }}
                    onAnimationEnd={() => handleRippleEnd(ripple.id)}
                />
            ))}
        </ButtonElement>
    );
};

export default DynamicButton;
