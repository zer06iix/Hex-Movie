import { useState } from 'react';
import sprite from '../../../styles/sprite.svg';

export default function CastImage({ member }) {
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
    };

    const finalImagePath = member.profile_path
        ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
        : 'path_to_placeholder_image'; // Fallback image URL

    return (
        <>
            {!imgError ? (
                <img
                    src={finalImagePath}
                    title={member.name}
                    alt={member.name}
                    className="cast-image"
                    onError={handleImageError}
                />
            ) : (
                <div className="cast-image-placeholder">
                    <svg className="placeholder-icon">
                        <use xlinkHref={`${sprite}#image-placeholder`} />
                    </svg>
                    <p className="placeholder-text">Not available</p>
                </div>
            )}
        </>
    );
}
