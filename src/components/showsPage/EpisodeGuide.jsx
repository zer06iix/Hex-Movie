import { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { API_KEY, BASE_URL } from '../../api/tmdb';

const EpisodeGuide = ({ showId, selectedSeason, onEpisodeCountChange }) => {
    const [episodes, setEpisodes] = useState([]);
    const [expandedEpisode, setExpandedEpisode] = useState(null);

    const containerRef = useRef(null);
    const contentRef = useRef(null);

    const [heightTransition, setHeightTransition] = useState(false);

    useEffect(() => {
        if (!showId || !selectedSeason) return;

        const fetchEpisodes = async () => {
            // Measure current height before load
            const currentHeight = containerRef.current?.offsetHeight;
            if (currentHeight) {
                containerRef.current.style.height = `${currentHeight}px`;
            }

            setHeightTransition(false);

            try {
                const response = await fetch(
                    `${BASE_URL}/tv/${showId}/season/${selectedSeason}?api_key=${API_KEY}`
                );
                const data = await response.json();
                const fetchedEpisodes = data.episodes || [];
                setEpisodes(fetchedEpisodes);
                setExpandedEpisode(null);

                if (onEpisodeCountChange) {
                    onEpisodeCountChange(fetchedEpisodes.length);
                }

                // Wait for next paint to allow content to be set
                requestAnimationFrame(() => {
                    const newHeight = contentRef.current?.offsetHeight;
                    if (newHeight) {
                        containerRef.current.style.height = `${newHeight}px`;
                        setHeightTransition(true);
                    }

                    // After transition ends, clear the explicit height
                    setTimeout(() => {
                        if (containerRef.current) {
                            containerRef.current.style.height = '';
                            setHeightTransition(false);
                        }
                    }, 400); // matches CSS transition duration
                });
            } catch (error) {
                console.error('Failed to fetch episodes:', error);
                setEpisodes([]);
                setExpandedEpisode(null);
                if (onEpisodeCountChange) {
                    onEpisodeCountChange(0);
                }
                containerRef.current.style.height = '';
            }
        };

        fetchEpisodes();
    }, [showId, selectedSeason, onEpisodeCountChange]);

    const toggleEpisode = (episodeNumber) => {
        setExpandedEpisode((prev) => (prev === episodeNumber ? null : episodeNumber));
    };

    return (
        <div
            ref={containerRef}
            className={`episode-guide-container ${heightTransition ? 'transitioning' : ''}`}
        >
            <div ref={contentRef}>
                <ul className="episode-list">
                    {episodes.map((ep) => {
                        const isOpen = expandedEpisode === ep.episode_number;
                        return (
                            <li
                                key={ep.id || `${selectedSeason}-${ep.episode_number}`}
                                className="episode-item"
                            >
                                <div
                                    className="episode-header"
                                    onClick={() => toggleEpisode(ep.episode_number)}
                                >
                                    <span className="episode-title">
                                        {ep.episode_number}. {ep.name}
                                    </span>
                                    <span className="toggle-icon">
                                        {isOpen ? '▼' : '▶'}
                                    </span>
                                </div>
                                <div
                                    className={`episode-overview-wrapper ${
                                        isOpen ? 'open' : ''
                                    }`}
                                >
                                    <p className="episode-overview">
                                        {ep.overview || 'No summary available.'}
                                    </p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

EpisodeGuide.displayName = 'EpisodeGuide';

EpisodeGuide.propTypes = {
    showId: PropTypes.number.isRequired,
    selectedSeason: PropTypes.number,
    onEpisodeCountChange: PropTypes.func
};

export default EpisodeGuide;
