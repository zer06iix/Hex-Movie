/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

const Slide = forwardRef(({ slide, posterDetail, eager = false }, ref) => {
    const mediaType = slide?.name ? 'shows' : 'movie';

    if (!slide) return null;

    const size = posterDetail ? 'w780' : 'w185';
    const placeholderSize = posterDetail ? 'w300' : 'w92';
    const imagePath = slide?.poster_path;
    const imageUrl = imagePath ? `https://image.tmdb.org/t/p/${size}${imagePath}` : null;
    const placeholderUrl = imagePath
        ? `https://image.tmdb.org/t/p/${placeholderSize}${imagePath}`
        : null;

    const imageElement = imageUrl ? (
        eager ? (
            <img
                className="carousel-images"
                src={imageUrl}
                alt={slide?.title || slide?.name}
                loading="eager"
            />
        ) : (
            <LazyLoadImage
                className="carousel-images"
                src={imageUrl}
                alt={slide?.title || slide?.name}
                placeholderSrc={placeholderUrl}
                effect="blur"
            />
        )
    ) : (
        <div className="no-image-placeholder">No Image Available</div>
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
