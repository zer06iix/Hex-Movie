import React from 'react';
import PropTypes from 'prop-types';
import DynamicButton from '../buttons/DynamicButton';
import MediaItem from './media/MediaItem';
import sprite from '../../styles/sprite.svg';
import HorizontalCarousel from '../app/HorizontalCarousel';

const FilmographySection = React.memo(
    ({ castDetailsData, castCreditsData, numberOfMedia, scrollId }) => {
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

        if (!castCreditsData?.cast?.length) return null;

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
                    scrollStep={300}
                    scrollId={scrollId}
                    componentName="FilmographySection"
                />
            </div>
        );
    }
);

FilmographySection.displayName = 'FilmographySection';

FilmographySection.propTypes = {
    castDetailsData: PropTypes.shape({
        gender: PropTypes.number,
        id: PropTypes.number
    }),
    castCreditsData: PropTypes.shape({
        cast: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number.isRequired,
                vote_average: PropTypes.number,
                vote_count: PropTypes.number
            })
        )
    }),
    numberOfMedia: PropTypes.number.isRequired,
    scrollId: PropTypes.number
};

export default FilmographySection;
