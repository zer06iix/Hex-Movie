/* eslint-disable no-unused-vars */
import { useState, useRef, useEffect, useCallback } from 'react';
import sprite from '../../styles/sprite.svg';
import useNavigationMenuStore from '../../stores/navigationMenuStore';

export default function NavigationMenu() {
    const { selectedIndex, setSelectedIndex } = useNavigationMenuStore();

    const buttonRefs = useRef([]);
    const setButtonRef = useCallback((el, index) => {
        buttonRefs.current[index] = el;
    }, []);

    useEffect(() => {
        if (buttonRefs.current[selectedIndex]) {
            buttonRefs.current[selectedIndex].classList.add('selected');
        }
    }, [selectedIndex]);

    const handleButtonClick = (index) => {
        if (buttonRefs.current[selectedIndex]) {
            buttonRefs.current[selectedIndex].classList.remove('selected');
        }
        setSelectedIndex(index);
        if (buttonRefs.current[index]) {
            buttonRefs.current[index].classList.add('selected');
        }
    };

    return (
        <div className="navigation-menu-container">
            <div className="navigation-menu-heading">
                <svg className="icon">
                    <use xlinkHref={`${sprite}#segment`} />
                </svg>
                <p className="title">Navigation Menu</p>
            </div>
            <div className="navigation-menu-content">
                <div className="indicator-line">
                    <div
                        className="indicator"
                        style={{ top: `${selectedIndex * 48}px` }}
                    ></div>
                </div>
                {[
                    'Trending Movies',
                    'Trending Shows',
                    'Popular Movies',
                    'Popular Shows',
                    'Upcoming Releases',
                    'Airing Today'
                ].map((item, index) => (
                    <button
                        className={`navigation-button`}
                        key={index}
                        ref={(el) => setButtonRef(el, index)}
                        onClick={() => handleButtonClick(index)}
                    >
                        {item}
                    </button>
                ))}
            </div>
        </div>
    );
}
