/* eslint-disable react/prop-types */
import { useState } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import sprite from '../../../styles/sprite.svg';
import ImagePlaceholder from '../../app/ImagePlaceholder';
import 'react-lazy-load-image-component/src/effects/blur.css';

export default function MediaImage({ media }) {
    const [imgError, setImgError] = useState(false);

    const imagePath = media?.poster_path || media?.backdrop_path;
    const imageUrl = imagePath ? `https://image.tmdb.org/t/p/w185${imagePath}` : null;

    const handleImageError = () => {
        setImgError(true);
    };

    if (imgError || !imageUrl) {
        return <ImagePlaceholder className="filmography" />;
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
