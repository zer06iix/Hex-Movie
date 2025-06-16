/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import PropTypes from 'prop-types';
import DynamicButton from '../buttons/DynamicButton';

const MediaGenre = ({ genres }) => {
    return (
        <div className="genre-container">
            {genres.map((genre) => (
                <DynamicButton className="genre-item" key={genre.id}>
                    {genre.name}
                </DynamicButton>
            ))}
        </div>
    );
};

// MediaGenre.propTypes = {
//     genres: PropTypes.arrayOf(PropTypes.string).isRequired
// };

export default MediaGenre;
