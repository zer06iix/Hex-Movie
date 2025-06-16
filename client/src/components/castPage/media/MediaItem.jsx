/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import MediaImage from './MediaImage';

export default function MediaItem({ media }) {
    const nameRef = useRef(null);
    const mediaRef = useRef(null);
    let mediaType;
    const [nameTitle, setNameTitle] = useState('');
    const [mediaTitle, setMediaTitle] = useState('');
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => {
        setImgError(true);
    };

    useEffect(() => {
        // Check if name overflows
        if (nameRef.current) {
            const overflow = nameRef.current.scrollWidth > nameRef.current.clientWidth;
            if (overflow) {
                setNameTitle(media.name);
            }
        }

        // Check if character overflows
        if (mediaRef.current) {
            const overflow = mediaRef.current.scrollWidth > mediaRef.current.clientWidth;
            if (overflow) {
                setMediaTitle(media.character || 'Unknown Character');
            }
        }
    }, [media]);

    switch (media.media_type) {
        case 'tv':
            mediaType = 'shows';
            break;
        case 'movie':
            mediaType = 'movie';
            break;
        default:
            mediaType = '';
    }

    return (
        <Link to={`/${mediaType}/${media.id}`} className="cast-media">
            <div className="media-image-container">
                {!imgError ? (
                    <MediaImage media={media} onError={handleImageError} />
                ) : null}
            </div>
            {/* <div className="detail">
                <p className="cast-character-name" ref={mediaRef} title={mediaTitle}>
                    {media.character || 'Unknown Character'}
                </p>
            </div> */}
        </Link>
    );
}
