/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import DynamicButton from '../../components/buttons/DynamicButton';
import MediaScroller from '../../components/castPage/media/MediaScroller';
import MediaItem from './media/MediaItem';
import sprite from '../../styles/sprite.svg';
import HorizontalCarousel from '../app/HorizantalCarousel';

const FilmographySection = React.memo(
    ({ castDetailsData, castCreditsData, numberOfMedia }) => {
        // const gender = castDetailsData.gender

        const sortedCastCredits = React.useMemo(() => {
            if (castCreditsData?.cast) {
                const uniqueMedia = new Map();
                castCreditsData.cast.forEach((media) => {
                    if (!uniqueMedia.has(media.id) && media.vote_count > 50) {
                        uniqueMedia.set(media.id, media);
                    }
                });
                return [...uniqueMedia.values()].sort(
                    (a, b) => b.vote_average - a.vote_average
                );
            }
            return [];
        }, [castCreditsData]);

        if (!castCreditsData?.cast) return null;

        return (
            <div className="filmography__section">
                <div className="filmography__header">
                    <p className="filmography__title">
                        {/* {gender == 2 ? 'His ' : 'Her '} Appearances */}
                        Appearances
                        <DynamicButton className="filmography__count">
                            {numberOfMedia}
                        </DynamicButton>
                        <svg className="filmography__heading-icon">
                            <use xlinkHref={`${sprite}#arrow-forward`} />
                        </svg>
                    </p>
                </div>
                <HorizontalCarousel
                    items={sortedCastCredits}
                    renderItem={(media) => <MediaItem media={media} />}
                    scrollKey="filmographyScroll"
                />
            </div>
        );
    }
);
FilmographySection.displayName = 'FilmographySection';

FilmographySection.propTypes = {
    castCreditsData: PropTypes.shape({
        // Should be an array of media objects
        cast: PropTypes.arrayOf(PropTypes.object)
    }),
    numberOfMedia: PropTypes.number.isRequired
};

export default FilmographySection;
