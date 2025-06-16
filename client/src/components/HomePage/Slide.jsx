/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import ImagePlaceholder from '../app/ImagePlaceholder';

const Slide = forwardRef(({ slide, posterDetail, eager = false }, ref) => {
    const [imgError, setImgError] = useState(false);
    const mediaType = slide?.name ? 'shows' : 'movie';

    if (!slide) return null;

    const handleImageError = () => {
        setImgError(true);
    };

    const size = posterDetail ? 'w780' : 'w185';
    const placeholderSize = posterDetail ? 'w300' : 'w92';
    const imagePath = slide?.poster_path;
    const imageUrl = imagePath ? `https://image.tmdb.org/t/p/${size}${imagePath}` : null;
    const placeholderUrl = imagePath
        ? `https://image.tmdb.org/t/p/${placeholderSize}${imagePath}`
        : null;

    if (imgError || !imageUrl) {
        return (
            <div className="carousel-cards">
                <Link
                    to={`/${mediaType}/${slide?.id}`}
                    onClick={() =>
                        console.log(`Navigating to ${slide?.title || slide?.name}`)
                    }
                    ref={ref}
                >
                    {eager ? (
                        <ImagePlaceholder className="carousel-images-main" />
                    ) : (
                        <ImagePlaceholder className="carousel-images-upnext" false />
                    )}
                </Link>
            </div>
        );
    }

    const imageElement = eager ? (
        <img
            className="carousel-images"
            src={imageUrl}
            alt={slide?.title || slide?.name}
            loading="eager"
            onError={handleImageError}
        />
    ) : (
        <LazyLoadImage
            className="carousel-images"
            src={imageUrl}
            alt={slide?.title || slide?.name}
            placeholderSrc={placeholderUrl}
            effect="blur"
            onError={handleImageError}
        />
    );

    return (
        <div className="carousel-cards">
            <Link
                to={`/${mediaType}/${slide?.id}`}
                onClick={() =>
                    console.log(`Navigating to ${slide?.title || slide?.name}`)
                }
                ref={ref}
            >
                {imageElement}
            </Link>
        </div>
    );
});

export default Slide;
