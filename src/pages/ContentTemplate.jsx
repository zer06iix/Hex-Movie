import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Loading from '../components/app/Loading';
import MediaExpandable from '../components/contentPage/MediaExpandable';
import DynamicButton from '../components/buttons/DynamicButton';
import MovieMeta from '../components/moviePage/MovieMeta';
import ShowsMeta from '../components/showsPage/ShowsMeta';
import MediaGenre from '../components/contentPage/MediaGenre';
import MediaRating from '../components/contentPage/MediaRating';
import MediaPoster from '../components/contentPage/MediaPoster';
import CastItem from '../components/contentPage/cast/CastItem';
import HorizontalCarousel from '../components/app/HorizontalCarousel';
import EpisodeGuide from '../components/showsPage/EpisodeGuide';
import SeasonSelector from '../components/showsPage/SeasonSelector';
import sprite from '../styles/sprite.svg';

import { ReactSVG } from 'react-svg';

const ContentTemplate = ({ type, media, creditsData, genresMap }) => {
    const [selectedSeason, setSelectedSeason] = useState(null);
    const [episodeCount, setEpisodeCount] = useState(0);

    useEffect(() => {
        if (media?.seasons?.length > 0) {
            const firstNormalSeason = media.seasons.find((s) => s.season_number > 0);
            if (firstNormalSeason) {
                setSelectedSeason(firstNormalSeason.season_number);
            }
        }
    }, [media]);

    const isMovie = type === 'Movie';

    const mediaTitle = isMovie ? media.title : media.name;

    if (!media || !genresMap) return <Loading />;

    const formattedRating = media.adult ? 'Rated R' : 'Rated PG';
    const ratingTitle = media.adult
        ? `R-rated movies are for adults, containing strong language, sexual content, violence, or drug use. Viewer discretion is advised.`
        : `PG-rated movies are suitable for general audiences but may have material that requires parental guidance for younger children.`;

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

    const imagePath =
        media.poster_path || media.profile_path
            ? `https://image.tmdb.org/t/p/w500${media.poster_path || media.profile_path}`
            : 'path_to_placeholder_image';

    const castList = creditsData?.cast || [];

    return (
        <div className="content-container">
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
                                firstAirDate={media.first_air_date}
                                lastAirDate={media.last_air_date}
                                inProduction={media.in_production}
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

                {castList.length > 0 && (
                    <div className="content-template__cast-section">
                        <div className="content-template__cast-header">
                            <p className="content-template__cast-title">
                                Cast Members
                                <DynamicButton className="content-template__cast-count">
                                    {castList.length}
                                </DynamicButton>
                                <svg className="content-template__cast-icon">
                                    <use xlinkHref={`${sprite}#arrow-forward`} />
                                </svg>
                            </p>
                            <DynamicButton className="content-template__view-full-credits-button">
                                Cast & crew
                            </DynamicButton>
                        </div>

                        <HorizontalCarousel
                            items={castList}
                            renderItem={(member) => <CastItem member={member} />}
                            scrollStep={300}
                            scrollKey={`cast-scroll-${media.id}`}
                        />
                    </div>
                )}

                {!isMovie && media.seasons?.length > 0 && (
                    <div className="content-template__episode-section">
                        <div className="content-template__episode-header">
                            <p className="content-template__episode-title">
                                Episode Guide
                                <DynamicButton className="content-template__episode-count">
                                    {episodeCount}
                                </DynamicButton>
                                <svg className="content-template__episode-icon">
                                    <use xlinkHref={`${sprite}#arrow-forward`} />
                                </svg>
                            </p>
                            <SeasonSelector
                                seasons={media.seasons}
                                selectedSeason={selectedSeason}
                                onChange={setSelectedSeason}
                            />
                        </div>

                        <EpisodeGuide
                            showId={media.id}
                            selectedSeason={selectedSeason}
                            onEpisodeCountChange={setEpisodeCount}
                        />
                    </div>
                )}
            </div>

            <ReactSVG src={sprite} style={{ display: 'none' }} />
        </div>
    );
};

ContentTemplate.propTypes = {
    type: PropTypes.oneOf(['Movie', 'Show']).isRequired,
    media: PropTypes.shape({
        id: PropTypes.number.isRequired,
        title: PropTypes.string,
        name: PropTypes.string,
        release_date: PropTypes.string,
        first_air_date: PropTypes.string,
        last_air_date: PropTypes.string,
        in_production: PropTypes.bool,
        adult: PropTypes.bool,
        runtime: PropTypes.number,
        genres: PropTypes.arrayOf(
            PropTypes.shape({
                id: PropTypes.number,
                name: PropTypes.string
            })
        ),
        vote_average: PropTypes.number,
        vote_count: PropTypes.number,
        popularity: PropTypes.number,
        overview: PropTypes.string,
        poster_path: PropTypes.string,
        profile_path: PropTypes.string,
        seasons: PropTypes.arrayOf(PropTypes.object)
    }).isRequired,
    creditsData: PropTypes.shape({
        cast: PropTypes.arrayOf(PropTypes.object)
    }),
    genresMap: PropTypes.object.isRequired
};

export default ContentTemplate;
