/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import Loading from '../components/app/Loading';
import CastScroller from '../components/contentPage/cast/CastScroller';
import MediaExpandable from '../components/contentPage/MediaExpandable';
import DynamicButton from '../components/buttons/DynamicButton';
import MovieMeta from '../components/moviePage/MovieMeta';
import ShowsMeta from '../components/showsPage/ShowsMeta';
import MediaGenre from '../components/contentPage/MediaGenre';
import MediaRating from '../components/contentPage/MediaRating';
import MediaPoster from '../components/contentPage/MediaPoster';
import sprite from '../styles/sprite.svg';
import { ReactSVG } from 'react-svg';

const ContentTemplate = ({ type, media, creditsData, genresMap }) => {
    const isMovie = type === 'Movie';
    const mediaTitle = isMovie ? media.title : media.name;

    const showFormattedDate = !isMovie ? (
        media.in_production ? (
            <span title={new Date(media.first_air_date).toLocaleDateString('en-GB')}>
                Since {media.first_air_date.slice(0, 4)}
            </span>
        ) : (
            <>
                <span title={new Date(media.first_air_date).toLocaleDateString('en-GB')}>
                    {media.first_air_date.slice(0, 4)}
                </span>
                {' - '}
                <span title={new Date(media.last_air_date).toLocaleDateString('en-GB')}>
                    {media.last_air_date.slice(0, 4)}
                </span>
            </>
        )
    ) : null;

    if (!media || !genresMap) return <Loading />;

    const formattedRating = media.adult ? 'Rated R' : 'Rated PG';
    const ratingTitle = media.adult
        ? `R-rated movies are for adults, containing \nstrong language, sexual content, violence, \nor drug use. Viewer discretion is advised.`
        : `PG-rated movies are suitable for general \naudiences but may have material that requires \nparental guidance for younger children.`;

    const formatRuntime = (runtime) =>
        !runtime
            ? null
            : runtime < 60
              ? `${runtime} min`
              : `${Math.floor(runtime / 60)} h${runtime % 60 ? ` ${runtime % 60} min` : ''}`;

    const getMovieTitleClass = (title) => {
        if (!title) return 'media-title--small';
        const length = title.length;
        return length < 25
            ? 'media-title--large'
            : length < 40
              ? 'media-title--medium'
              : 'media-title--small';
    };

    const imagePath = media.poster_path || media.profile_path
        ? `https://image.tmdb.org/t/p/w500${media.poster_path || media.profile_path}`
        : 'path_to_placeholder_image'; // Fallback image


    return (
        <div className="content-container">
            {/* Static fallback background color */}
            <div
                className="content-template__background-overlay"
                style={{ backgroundColor: 'rgba(0, 0, 0, 0.25)' }}
            ></div>

            <div className="content-template__detail-container">
                <div className="content-template__heading-section">
                    <MediaPoster imagePath={imagePath} mediaTitle={mediaTitle} />

                    <div className="content-template__main-details">
                        <div className={`media-title ${getMovieTitleClass(mediaTitle)}`}>
                            {mediaTitle}
                        </div>

                        {isMovie ? (
                            <MovieMeta
                                releaseDate={media.release_date}
                                adult={media.adult}
                                ratingTitle={ratingTitle}
                                formattedRating={formattedRating}
                                formattedRuntime={formatRuntime(media.runtime)}
                            />
                        ) : (
                            <ShowsMeta
                                showFormattedDate={showFormattedDate}
                                seasonsCount={media.seasons.length}
                                adult={media.adult}
                                ratingTitle={ratingTitle}
                                formattedRating={formattedRating}
                            />
                        )}

                        <MediaGenre genres={media.genres} />

                        <MediaRating
                            voteAverage={media.vote_average}
                            voteCount={media.vote_count}
                            popularity={media.popularity}
                        />

                        <MediaExpandable
                            titleText="Overview"
                            content={media.overview}
                            expanderText={['Expand', 'Collapse']}
                        />
                    </div>
                </div>

                {creditsData?.cast?.length > 0 && (
                    <div className="content-template__cast-section">
                        <div className="content-template__cast-header">
                            <p className="content-template__cast-title">
                                Cast Members
                                <DynamicButton className="content-template__cast-count">
                                    {creditsData.cast.length}
                                </DynamicButton>
                                <svg className="content-template__cast-icon">
                                    <use xlinkHref={`${sprite}#arrow-forward`} />
                                </svg>
                            </p>
                            <DynamicButton className="content-template__view-full-credits-button">
                                Cast & crew
                            </DynamicButton>
                        </div>
                        <CastScroller
                            mediaId={media.id}
                            mediaType={isMovie ? 'movie' : 'shows'}
                        />
                    </div>
                )}
            </div>

            <ReactSVG src={sprite} style={{ display: 'none' }} />
        </div>
    );
};

export default ContentTemplate;
