import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';

/* eslint-disable react/prop-types */
export default function PreviousButton({ className, onClick }) {
    return (
        <button onClick={onClick} className={className}>
            <svg className="icon">
                <use xlinkHref={`${sprite}#arrow-previous`} />
            </svg>
        </button>
    );
}

PreviousButton.propTypes = {
    className: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
    disabled: PropTypes.bool.isRequired
};
