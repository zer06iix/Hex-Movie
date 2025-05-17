import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import useShowStore from '../../stores/showStore';
import { countryNames } from '../../api/countries';
import Tooltip from '../../components/app/Tooltip';

const ShowsMeta = ({
    firstAirDate,
    lastAirDate,
    inProduction,
    seasonsCount,
    adult,
    ratingTitle,
    formattedRating
}) => {
    const { shows } = useShowStore();

    const formatTooltipDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const getYear = (dateString) => new Date(dateString).getFullYear();

    const showFormattedDate = inProduction ? (
        <Tooltip content={formatTooltipDate(firstAirDate)}>
            <span>Since {getYear(firstAirDate)}</span>
            <sup>
                <svg className="metadata-icon">
                    <use xlinkHref={`${sprite}#help`} />
                </svg>
            </sup>
        </Tooltip>
    ) : (
        <>
            <Tooltip content={formatTooltipDate(firstAirDate)}>
                <span>{getYear(firstAirDate)}</span>
                <sup>
                    <svg className="metadata-icon">
                        <use xlinkHref={`${sprite}#help`} />
                    </svg>
                </sup>
            </Tooltip>
            {' - '}
            <Tooltip content={formatTooltipDate(lastAirDate)}>
                <span>{getYear(lastAirDate)}</span>
                <sup>
                    <svg className="metadata-icon">
                        <use xlinkHref={`${sprite}#help`} />
                    </svg>
                </sup>
            </Tooltip>
        </>
    );

    return (
        <p className="metadata">
            {showFormattedDate}

            <span className="separator">•</span>

            {`${seasonsCount} Seasons`}

            <>
                <span className="separator">•</span>
                {Array.isArray(shows.origin_country) ? (
                    shows.origin_country.map((country, index) => (
                        <Tooltip key={country} content={countryNames[country]}>
                            <span>
                                {country}
                                {index < shows.origin_country.length - 1 ? ', ' : ''}
                            </span>
                            <sup>
                                <svg className="metadata-icon">
                                    <use xlinkHref={`${sprite}#help`} />
                                </svg>
                            </sup>
                        </Tooltip>
                    ))
                ) : (
                    <Tooltip content={countryNames[shows.origin_country]}>
                        <span>{shows.origin_country}</span>
                        <sup>
                            <svg className="metadata-icon">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
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

ShowsMeta.propTypes = {
    firstAirDate: PropTypes.string.isRequired,
    lastAirDate: PropTypes.string.isRequired,
    inProduction: PropTypes.bool.isRequired,
    seasonsCount: PropTypes.number.isRequired,
    adult: PropTypes.bool,
    ratingTitle: PropTypes.string,
    formattedRating: PropTypes.string
};

export default ShowsMeta;
