import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';

const MediaRating = ({ voteAverage, voteCount, popularity }) => {
    return (
        <div className="rating-container">
            <div className="item imdb-rating">
                <p className="label">IMDb Rating</p>
                <div className="value">
                    <svg className="icon">
                        <use xlinkHref={`${sprite}#rating-icon`} />
                    </svg>
                    <p className="average">{voteAverage.toFixed(1)}</p>
                </div>
            </div>

            <span className="separator"></span>

            <div className="item vote-count">
                <p className="label">Vote Count</p>
                <div className="value">
                    <svg className="icon">
                        <use xlinkHref={`${sprite}#vote-count`} />
                    </svg>
                    <p className="average">{voteCount}</p>
                </div>
            </div>

            <span className="separator"></span>

            <div className="item popularity">
                <p className="label">Popularity</p>
                <div className="value">
                    <svg className="icon">
                        <use xlinkHref={`${sprite}#popularity`} />
                    </svg>
                    <p className="average">
                        {popularity >= 1000
                            ? `${(popularity / 1000).toFixed(1)}k`
                            : popularity.toFixed(0)}
                    </p>
                </div>
            </div>
        </div>
    );
};

MediaRating.propTypes = {
    voteAverage: PropTypes.number.isRequired,
    voteCount: PropTypes.number.isRequired,
    popularity: PropTypes.number.isRequired
};

export default MediaRating;
