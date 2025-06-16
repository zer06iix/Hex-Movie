import React, { useState, useRef, useEffect, useCallback } from 'react';
import sprite from '../../styles/sprite.svg';
import PropTypes from 'prop-types';

const DROPDOWN_OPTIONS = [
    { value: 'tmdb', label: 'TMDB' },
    { value: 'wikipedia', label: 'Wikipedia' }
];

const CustomDropdown = React.memo(({ bioSource, setBioSource }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const currentOptionLabel =
        DROPDOWN_OPTIONS.find((option) => option.value === bioSource)?.label || '';

    const toggleOpen = useCallback(() => setIsOpen(!isOpen), [isOpen]);

    const handleOptionClick = useCallback(
        (value) => {
            setBioSource(value);
            setIsOpen(false);
        },
        [setBioSource]
    );

    useEffect(() => {
        function handleClickOutside(event) {
            if (
                isOpen &&
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    return (
        <div className="custom-dropdown" ref={dropdownRef}>
            <div className="custom-dropdown__button" onClick={toggleOpen}>
                <div className="custom-dropdown__button-text">{currentOptionLabel}</div>
                <svg className="custom-dropdown__icon">
                    <use xlinkHref={`${sprite}#arrow-dropdown`} />
                </svg>
            </div>
            <div className={`custom-dropdown__options ${isOpen ? 'open' : ''}`}>
                {DROPDOWN_OPTIONS.map((option) => (
                    <div
                        key={option.value}
                        className="custom-dropdown__option"
                        onClick={() => handleOptionClick(option.value)}
                    >
                        {option.label}
                    </div>
                ))}
            </div>
        </div>
    );
});
CustomDropdown.displayName = 'CustomDropdown';

CustomDropdown.propTypes = {
    bioSource: PropTypes.oneOf(['tmdb', 'wikipedia']).isRequired,
    setBioSource: PropTypes.func.isRequired
};

export default CustomDropdown;
