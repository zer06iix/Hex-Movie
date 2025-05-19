import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

const SeasonSelector = ({ seasons, selectedSeason, onChange }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [focusedIndex, setFocusedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const optionRefs = useRef([]);

    const sortedSeasons = [...seasons]
        .filter((season) => season.season_number > 0)
        .sort((a, b) => a.season_number - b.season_number);

    const selectedSeasonName =
        sortedSeasons.find((s) => s.season_number === selectedSeason)?.name ||
        `Season ${selectedSeason}`;

    useEffect(() => {
        optionRefs.current = [];
    }, [seasons]);

    useEffect(() => {
        if (dropdownOpen && focusedIndex >= 0) {
            const el = optionRefs.current[focusedIndex];
            if (el) {
                el.scrollIntoView({
                    block: 'nearest',
                    behavior: 'smooth'
                });
            }
        }
    }, [focusedIndex, dropdownOpen]);

    useEffect(() => {
        if (!dropdownOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setFocusedIndex((prev) => (prev + 1) % sortedSeasons.length);
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                setFocusedIndex((prev) =>
                    prev <= 0 ? sortedSeasons.length - 1 : prev - 1
                );
            } else if (e.key === 'Enter' && focusedIndex >= 0) {
                onChange(sortedSeasons[focusedIndex].season_number);
                setDropdownOpen(false);
                setFocusedIndex(-1);
            } else if (e.key === 'Escape') {
                setDropdownOpen(false);
                setFocusedIndex(-1);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [dropdownOpen, focusedIndex, sortedSeasons, onChange]);

    useEffect(() => {
        if (dropdownOpen && dropdownRef.current) {
            dropdownRef.current.focus();
        }
    }, [dropdownOpen]);

    return (
        <div className="season-dropdown" tabIndex={0} ref={dropdownRef}>
            <div
                className="season-dropdown-toggle"
                onClick={() => {
                    setDropdownOpen(!dropdownOpen);
                    setFocusedIndex(-1);
                }}
            >
                {selectedSeasonName}
                <span className="arrow">{dropdownOpen ? '▲' : '▼'}</span>
            </div>

            <ul
                className={`season-dropdown-options ${
                    dropdownOpen ? 'dropdown-visible' : 'dropdown-hidden'
                }`}
            >
                {sortedSeasons.map((season, index) => (
                    <li
                        key={season.season_number}
                        ref={(el) => (optionRefs.current[index] = el)}
                        className={`season-option ${
                            index === focusedIndex ? 'focused' : ''
                        }`}
                        onClick={() => {
                            onChange(season.season_number);
                            setDropdownOpen(false);
                            setFocusedIndex(-1);
                        }}
                    >
                        {season.name || `Season ${season.season_number}`}
                    </li>
                ))}
            </ul>
        </div>
    );
};

SeasonSelector.propTypes = {
    seasons: PropTypes.arrayOf(
        PropTypes.shape({
            season_number: PropTypes.number.isRequired,
            name: PropTypes.string
        })
    ).isRequired,
    selectedSeason: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
};

SeasonSelector.displayName = 'SeasonSelector';

export default SeasonSelector;
