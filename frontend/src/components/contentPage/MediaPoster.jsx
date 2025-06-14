import PropTypes from 'prop-types';
import sprite from '../../styles/sprite.svg';
import ImagePlaceholder from '../app/ImagePlaceholder';
import { useState, useEffect, useRef } from 'react';

const MediaPoster = ({ imagePath, mediaTitle }) => {
    const [showOverlay, setShowOverlay] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [renderModal, setRenderModal] = useState(false);
    const [imgError, setImgError] = useState(false);
    const posterWrapperRef = useRef(null);

    const handleImageError = () => setImgError(true);

    const handleMouseEnter = () => {
        if (imagePath && !imgError) {
            setShowOverlay(true);
        }
    };

    const handleMouseLeave = () => {
        setShowOverlay(false);
    };

    const handlePosterClick = () => {
        if (imagePath && !imgError) {
            setRenderModal(true);
            setTimeout(() => {
                setIsModalOpen(true);
            }, 0);
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => {
            setRenderModal(false);
        }, 300);
    };

    useEffect(() => {
        if (renderModal) {
            setShowOverlay(false);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [renderModal]);

    const finalImagePath = imagePath
        ? `https://image.tmdb.org/t/p/w500${imagePath}`
        : null;

    return (
        <div className="media-poster-container">
            {finalImagePath && !imgError ? (
                <div
                    ref={posterWrapperRef}
                    className="media-poster-wrapper"
                    onClick={handlePosterClick}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <img
                        className="media-poster-image"
                        src={finalImagePath}
                        alt={mediaTitle}
                        onError={handleImageError}
                    />
                    <div
                        className={`media-hover-overlay ${showOverlay ? 'visible' : ''}`}
                    >
                        <svg className="media-hover-overlay-icon">
                            <use xlinkHref={`${sprite}#fullscreen`} />
                        </svg>
                    </div>
                </div>
            ) : (
                <ImagePlaceholder className="media-poster-placeholder" />
            )}

            {renderModal && shouldShowImage && (
                <div
                    className={`reusable-fullscreen-modal ${isModalOpen ? 'active' : ''}`}
                    onClick={handleCloseModal}
                >
                    <div className="reusable-modal-content">
                        <img
                            className="reusable-modal-image"
                            src={finalImagePath}
                            alt={mediaTitle}
                            onError={handleImageError}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

MediaPoster.propTypes = {
    imagePath: PropTypes.string,
    mediaTitle: PropTypes.string.isRequired
};

export default MediaPoster;
