import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import useShowStore from '../../stores/showStore';
import { countryNames } from '../../api/countries';
import Tooltip from '../../components/app/Tooltip';

const ShowsMeta = ({
    showFormattedDate,
    seasonsCount,
    adult,
    ratingTitle,
    formattedRating
}) => {
    const { shows } = useShowStore();

    return (
        <p className="metadata">
            <span>{showFormattedDate}</span>
            <sup>
                <svg className="metadata-icon">
                    <use xlinkHref={`${sprite}#help`} />
                </svg>
            </sup>

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
                        </Tooltip>
                    ))
                ) : (
                    <Tooltip content={countryNames[shows.origin_country]}>
                        <span>{shows.origin_country}</span>
                    </Tooltip>
                )}
                <sup>
                    <svg className="metadata-icon">
                        <use xlinkHref={`${sprite}#help`} />
                    </svg>
                </sup>
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
    showFormattedDate: PropTypes.string.isRequired,
    seasonsCount: PropTypes.number.isRequired,
    adult: PropTypes.bool,
    ratingTitle: PropTypes.string,
    formattedRating: PropTypes.string
};

export default ShowsMeta;
