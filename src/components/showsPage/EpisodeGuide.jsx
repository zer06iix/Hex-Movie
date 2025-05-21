import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@tanstack/react-query';
import useFetchStore from '../../stores/fetchStore';

const EpisodeGuide = ({ showId, selectedSeason, onEpisodeCountChange }) => {
    const [expandedEpisode, setExpandedEpisode] = useState(null);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [heightTransition, setHeightTransition] = useState(false);
    const { fetchEpisodes } = useFetchStore();

    const { data: episodes = [], isLoading, isError } = useQuery({
        queryKey: ['episodes', showId, selectedSeason],
        queryFn: () => fetchEpisodes(showId, selectedSeason),
        enabled: !!showId && !!selectedSeason,
    });

    // Handle episode count changes
    useEffect(() => {
        if (!onEpisodeCountChange) return;
        
        // Call with 0 when there's an error or no episodes
        if (isError || !episodes.length) {
            onEpisodeCountChange(0);
            return;
        }

        // Call with actual count when we have episodes
        onEpisodeCountChange(episodes.length);
    }, [episodes, isError, onEpisodeCountChange]);

    // Handle height transitions when episodes change
    useEffect(() => {
        if (!episodes.length) {
            containerRef.current?.style?.height && (containerRef.current.style.height = '');
            return;
        }

        const currentHeight = containerRef.current?.offsetHeight;
        if (currentHeight) {
            containerRef.current.style.height = `${currentHeight}px`;
        }

        requestAnimationFrame(() => {
            const newHeight = contentRef.current?.offsetHeight;
            if (newHeight) {
                containerRef.current.style.height = `${newHeight}px`;
                setHeightTransition(true);
            }

            setTimeout(() => {
                if (containerRef.current) {
                    containerRef.current.style.height = '';
                    setHeightTransition(false);
                }
            }, 400);
        });
    }, [episodes]);

    const toggleEpisode = (episodeNumber) => {
        setExpandedEpisode((prev) => (prev === episodeNumber ? null : episodeNumber));
    };

    if (isLoading) {
        return <div className="episode-guide-container">Loading episodes...</div>;
    }

    if (isError) {
        return <div className="episode-guide-container">Failed to load episodes.</div>;
    }

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