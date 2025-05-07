/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import NextButton from '../../buttons/NextButton';
import PreviousButton from '../../buttons/PreviousButton';

import PreviousSlide from './PreviousSlide';
import CurrentSlide from './CurrentSlide';
import NextSlide from './NextSlide';

import MouseDownDetector from './MouseDownDetector';
import useCarouselStore from '../../../stores/carouselStore';
import VoteAverage from '../imageCarousel/VoteAverage';

export default function MediaCarousel({ media, wrapperRef, upNextWrapperRef, selectedIndex }) {
    const transitionLength = 380;
    const currentSlideRef = useRef(null);
    const { prevSlide, currentSlide, nextSlide } = useCarouselStore();
    const [isDragging, setIsDragging] = useState(false);
    const [displayedMedia, setDisplayedMedia] = useState(null);

    const totalSlides = media.length;
    const prevSlideIndex = Math.max(0, (currentSlide - 1 + totalSlides) % totalSlides);
    const nextSlideIndex = Math.min(totalSlides - 1, (currentSlide + 1) % totalSlides);

    const [carouselDisabled, setCarouselDisabled] = useState(false);
    const [upNextDisabled, setUpNextDisabled] = useState(false);

    useEffect(() => {
        setDisplayedMedia(media[selectedIndex]);
    }, [selectedIndex, media]);

    const handleMouseDetectorClick = () => {
        if (currentSlideRef.current) {
            currentSlideRef.current.click();
        }
    };

    // Update the carousel detail instantly before the transition
    const updateCarouselDetail = (direction) => {
        const newIndex = direction === 1 
            ? (currentSlide + 1) % totalSlides 
            : (currentSlide - 1 + totalSlides) % totalSlides;
        
        const newSlide = media[newIndex];
        setDisplayedMedia(newSlide);
    };

    // Handle carousel transition (Next/Previous buttons)
    const handleCarouselTransition = (direction) => {
        if (carouselDisabled) return;
        setCarouselDisabled(true);

        // Update carousel detail instantly before transition
        updateCarouselDetail(direction);

        const wrapper = wrapperRef.current;
        wrapper.style.transition = `transform ${transitionLength}ms ease`;
        wrapper.style.transform = `translateX(${direction * -100}%)`;

        setTimeout(() => {
            wrapper.style.transition = 'none';
            wrapper.style.transform = 'translateX(0%)';
            direction === 1 ? nextSlide() : prevSlide();
            setIsDragging(true);
            setTimeout(() => {
                wrapper.style.transition = `transform ${transitionLength}ms ease`;
                setIsDragging(false);
            }, 20);
        }, transitionLength);

        setTimeout(() => {
            setCarouselDisabled(false);
        }, transitionLength + 20);
    };

    // Handle UpNext section transition (up and down)
    const handleUpNextTransition = (direction) => {
        if (upNextDisabled) return;
        setUpNextDisabled(true);

        const wrapper = upNextWrapperRef.current;
        if (!wrapper) return;

        const firstChild = wrapper.children[0];
        const secondChild = wrapper.children[1];
        const secondLastChild = wrapper.children[wrapper.children.length - 2];
        const lastChild = wrapper.children[wrapper.children.length - 1];

        wrapper.style.transition = `transform ${transitionLength}ms ease`;
        wrapper.style.transform = `translateY(${-direction * 120}px)`; // Up and down movement

        switch (direction) {
            case 1:
                secondChild.style.transition = `opacity ${transitionLength}ms ease`;
                secondChild.style.opacity = '0';
                lastChild.style.transition = `opacity ${transitionLength}ms ease`;
                lastChild.style.opacity = '1';
                break;
            case -1:
                secondLastChild.style.transition = `opacity ${transitionLength}ms ease`;
                secondLastChild.style.opacity = '0';
                firstChild.style.transition = `opacity ${transitionLength}ms ease`;
                firstChild.style.opacity = '1';
                break;
        }

        setTimeout(() => {
            wrapper.style.transition = 'none';
            wrapper.style.transform = 'translateY(0px)';
            for (let i = 0; i < wrapper.children.length; i++) {
                wrapper.children[i].style.transition = 'none';
                wrapper.children[i].style.opacity = '1';
            }
            if (direction === 1) lastChild.style.opacity = '0';
            if (direction === -1) firstChild.style.opacity = '0';
        }, transitionLength);

        setTimeout(() => {
            setUpNextDisabled(false);
        }, transitionLength + 20);
    };

    useEffect(() => {
        setIsDragging(false);
    }, [currentSlide]);

    return (
        <div className="carousel-container">
            <div className="carousel-mask">
                <PreviousButton
                    className="carouselBtns prevBtn"
                    onClick={() => {
                        handleUpNextTransition(-1);
                        handleCarouselTransition(-1);
                    }}
                    disabled={carouselDisabled}
                />
                <div className="carousel-wrapper" ref={wrapperRef}>
                    <PreviousSlide slide={media[prevSlideIndex]} />
                    <CurrentSlide slide={media[currentSlide]} ref={currentSlideRef} />
                    <NextSlide slide={media[nextSlideIndex]} />
                </div>

                {displayedMedia && (
                    <div className="carousel-detail-bg fixed-carousel-detail">
                        <div key={displayedMedia.id} className="carousel-detail-content fade-in">
                            <p className="carousel-detail-title">
                                {displayedMedia.title || displayedMedia.name} (
                                {displayedMedia.release_date
                                    ? new Date(displayedMedia.release_date).getFullYear()
                                    : displayedMedia.first_air_date
                                      ? new Date(displayedMedia.first_air_date).getFullYear()
                                      : 'N/A'}
                                )
                            </p>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                                <VoteAverage voteAverage={displayedMedia.vote_average} />
                                <span style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                                    /10 Rating
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <MouseDownDetector
                    onMouseUp={() => setIsDragging(false)}
                    onMouseLeave={() => setIsDragging(false)}
                    onDragLeft={() => {
                        handleUpNextTransition(1);
                        handleCarouselTransition(1);
                    }}
                    onDragRight={() => {
                        handleUpNextTransition(-1);
                        handleCarouselTransition(-1);
                    }}
                    clickCurrentSlide={handleMouseDetectorClick}
                    style={{ cursor: isDragging ? 'grabbing' : 'default' }}
                />

                <NextButton
                    className="carouselBtns nextBtn"
                    onClick={() => {
                        handleUpNextTransition(1);
                        handleCarouselTransition(1);
                    }}
                    disabled={carouselDisabled}
                />
            </div>
        </div>
    );
}

MediaCarousel.propTypes = {
    media: PropTypes.arrayOf(PropTypes.object).isRequired,
    wrapperRef: PropTypes.object.isRequired,
    upNextWrapperRef: PropTypes.object.isRequired,
    selectedIndex: PropTypes.number.isRequired,
};
