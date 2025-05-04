/* eslint-disable react/prop-types */
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import sprite from '../../../styles/sprite.svg';

export default function MediaImage({ media }) {
    const [imgError, setImgError] = useState(false);

    const imagePath = media?.poster_path || media?.backdrop_path;
    const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w185${imagePath}` : null;

    const handleImageError = () => {
        setImgError(true);
    };

    if (imgError || !imageUrl) {
        return (
            <div className="media-image-placeholder">
                <svg className="placeholder-icon">
                    <use xlinkHref={`${sprite}#image-placeholder`} />
                </svg>
                <p className="placeholder-text">Not available</p>
            </div>
        );
    }

    return (
        <LazyLoadImage
            alt={media.title || media.name}
            title={media.title || media.name}
            src={imageUrl}
            effect="blur"
            onError={handleImageError}
            className="media-item-image"
            wrapperClassName="media-image-wrapper"
        />
    );
}
