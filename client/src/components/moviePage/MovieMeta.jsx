import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import useMovieStore from '../../stores/movieStore';
import { countryNames } from '../../api/countries';
import Tooltip from '../app/Tooltip';

const MovieMetadata = ({
    releaseDate,
    adult,
    ratingTitle,
    formattedRating,
    formattedRuntime
}) => {
    const { movie } = useMovieStore();
    const parsedReleaseDate = new Date(releaseDate);
    const tooltipReleaseDate = [
        parsedReleaseDate.getDate(),
        parsedReleaseDate.getMonth() + 1,
        parsedReleaseDate.getFullYear()
    ].join('/');
    const releaseYear = parsedReleaseDate.getFullYear();

    return (
        <p className="metadata">
            <Tooltip content={tooltipReleaseDate} placement="auto">
                <span>
                    {releaseYear}
                    <sup>
                        <svg className="metadata-icon">
                            <use xlinkHref={`${sprite}#help`} />
                        </svg>
                    </sup>
                </span>
            </Tooltip>

            {formattedRuntime !== null && (
                <>
                    <span className="separator">•</span>
                    {formattedRuntime}
                </>
            )}

            <>
                <span className="separator">•</span>
                {Array.isArray(movie.origin_country) ? (
                    movie.origin_country.map((country, index) => {
                        const label = countryNames[country];
                        return (
                            <>
                                <Tooltip key={country} content={label}>
                                    <span>
                                        {country}
                                        <sup>
                                            <svg className="metadata-icon">
                                                <use xlinkHref={`${sprite}#help`} />
                                            </svg>
                                        </sup>
                                    </span>
                                </Tooltip>

                                {index < movie.origin_country.length - 1 ? ', ' : ''}
                            </>
                        );
                    })
                ) : (
                    <Tooltip content={countryNames[movie.origin_country]}>
                        <span>
                            {movie.origin_country}
                            <sup>
                                <svg className="metadata-icon">
                                    <use xlinkHref={`${sprite}#help`} />
                                </svg>
                            </sup>
                        </span>
                    </Tooltip>
                )}
            </>

            {adult !== undefined && (
                <>
                    <span className="separator">•</span>
                    <Tooltip content={ratingTitle}>
                        <span>
                            {formattedRating}
                            <sup>
                                <svg className="metadata-icon">
                                    <use xlinkHref={`${sprite}#help`} />
                                </svg>
                            </sup>
                        </span>
                    </Tooltip>
                </>
            )}
        </p>
    );
};

MovieMetadata.propTypes = {
    releaseDate: PropTypes.string.isRequired,
    runtime: PropTypes.number,
    adult: PropTypes.bool,
    ratingTitle: PropTypes.string,
    formattedRating: PropTypes.string,
    formattedRuntime: PropTypes.string
};

export default MovieMetadata;
