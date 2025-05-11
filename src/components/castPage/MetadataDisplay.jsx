import React from 'react';
import sprite from '../../styles/sprite.svg';
import Tooltip from '../app/Tooltip';
import PropTypes from 'prop-types';

const MetadataDisplay = React.memo(({ castDetailsData, age }) => {
    return (
        <p className="cast-member-details-page__metadata">
            {castDetailsData?.deathday ? (
                <Tooltip
                    content={new Date(castDetailsData.deathday).toLocaleDateString('en-GB')}
                    placement='auto'
                >
                    Passed away at {age}
                    <sup>
                        <svg className="cast-member-details-page__metadata-icon">
                            <use xlinkHref={`${sprite}#help`} />
                        </svg>
                    </sup>
                </Tooltip>
            ) : (
                castDetailsData?.birthday && (
                    <Tooltip
                        content={new Date(castDetailsData.birthday).toLocaleDateString(
                            'en-GB'
                        )}
                        placement='auto'
                    >
                        {age} years old
                        <sup>
                            <svg className="cast-member-details-page__metadata-icon">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
                    </Tooltip>
                )
            )}

            {castDetailsData?.place_of_birth && (
                <>
                    <span className="cast-member-details-page__metadata-separator">
                        •
                    </span>
                    <Tooltip content="Place of Birth" placement='auto'>
                        {castDetailsData.place_of_birth}
                        <sup>
                            <svg className="cast-member-details-page__metadata-icon ">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
                    </Tooltip>
                </>
            )}

            {castDetailsData?.known_for_department && (
                <>
                    <span className="cast-member-details-page__metadata-separator">
                        •
                    </span>
                    <Tooltip content="Known For" placement='auto'>
                        {castDetailsData.known_for_department}
                        <sup>
                            <svg className="cast-member-details-page__metadata-icon">
                                <use xlinkHref={`${sprite}#help`} />
                            </svg>
                        </sup>
                    </Tooltip>
                </>
            )}
        </p>
    );
});
MetadataDisplay.displayName = 'MetadataDisplay';

MetadataDisplay.propTypes = {
    castDetailsData: PropTypes.shape({
        deathday: PropTypes.string,
        birthday: PropTypes.string,
        place_of_birth: PropTypes.string,
        known_for_department: PropTypes.string
    }),
    age: PropTypes.number
};

export default MetadataDisplay;
