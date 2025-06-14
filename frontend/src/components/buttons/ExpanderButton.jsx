/* eslint-disable no-unused-vars */
import React, { forwardRef, useRef, useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';

const ExpanderButton = forwardRef(
    ({ onClick, className, isExpanded, expanderText = ['More', 'Less'] }, ref) => {
        const moreRef = useRef(null);
        const lessRef = useRef(null);
        const [buttonWidth, setButtonWidth] = useState(null);
        const widthOffset = 18;

        useEffect(() => {
            // Calculate initial width based on the longer text
            const moreWidth = moreRef.current?.offsetWidth || 0;
            const lessWidth = lessRef.current?.offsetWidth || 0;
            setButtonWidth(Math.min(moreWidth, lessWidth) + widthOffset);
        }, [widthOffset, expanderText]);

        const handleClick = useCallback(() => {
            onClick(); // Call the original onClick handler

            const moreWidth = moreRef.current?.offsetWidth || 0;
            const lessWidth = lessRef.current?.offsetWidth || 0;

            setButtonWidth(
                isExpanded ? moreWidth + widthOffset : lessWidth + widthOffset
            );
        }, [onClick, isExpanded, widthOffset]);

        return (
            <button
                ref={ref}
                className={className}
                onClick={handleClick}
                style={{
                    width: buttonWidth ? `${buttonWidth}px` : 'auto'
                }}
            >
                <p
                    ref={moreRef}
                    style={{
                        opacity: isExpanded ? 0 : 1,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {expanderText[0]}
                </p>
                <p
                    ref={lessRef}
                    style={{
                        opacity: isExpanded ? 1 : 0,
                        whiteSpace: 'nowrap'
                    }}
                >
                    {expanderText[1]}
                </p>
            </button>
        );
    }
);

ExpanderButton.propTypes = {
    onClick: PropTypes.func.isRequired,
    className: PropTypes.string.isRequired,
    isExpanded: PropTypes.bool.isRequired,
    expanderText: PropTypes.arrayOf(PropTypes.string).isRequired
};

ExpanderButton.displayName = 'ExpanderButton';

export default ExpanderButton;
