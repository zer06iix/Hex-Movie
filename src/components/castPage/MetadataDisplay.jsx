import React from 'react';
import sprite from '../../styles/sprite.svg';
import Tooltip from '../app/Tooltip';
import PropTypes from 'prop-types';

const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return [date.getDate(), date.getMonth() + 1, date.getFullYear()].join('/');
};

const MetadataItem = ({ tooltip, children }) => (
    <Tooltip content={tooltip}>
        <>
            {children}
            <sup>
                <svg className="cast-member-details-page__metadata-icon">
                    <use xlinkHref={`${sprite}#help`} />
                </svg>
            </sup>
        </>
    </Tooltip>
);

const MetadataDisplay = React.memo(({ castDetailsData, age }) => {
    const { deathday, birthday, place_of_birth, known_for_department } =
        castDetailsData || {};

    const dateTooltip = deathday ? (
        <>
            <div>Born: {formatDate(birthday)}</div>
            <div>Died: {formatDate(deathday)}</div>
        </>
    ) : birthday ? (
        formatDate(birthday)
    ) : (
        ''
    );

    return (
        <p className="cast-member-details-page__metadata">
            {birthday && (
                <MetadataItem tooltip={dateTooltip}>
                    {deathday ? `Passed away at ${age}` : `${age} years old`}
                </MetadataItem>
            )}

            {place_of_birth && (
                <>
                    <span className="cast-member-details-page__metadata-separator">
                        •
                    </span>
                    <MetadataItem tooltip="Place of Birth">{place_of_birth}</MetadataItem>
                </>
            )}

            {known_for_department && (
                <>
                    <span className="cast-member-details-page__metadata-separator">
                        •
                    </span>
                    <MetadataItem tooltip="Known For">
                        {known_for_department}
                    </MetadataItem>
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
