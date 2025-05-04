import { useRef, useState, useCallback, useMemo, useEffect } from 'react';
import useCastStore from '../../../stores/castStore';
import MediaItem from './MediaItem';
import NextButton from '../../buttons/NextButton';
import PreviousButton from '../../buttons/PreviousButton';

const SCROLL_KEY = 'mediaScrollerTranslateX';

export default function MediaScroller() {
    const { castCredits } = useCastStore();

    const wrapperRef = useRef(null);
    const containerRef = useRef(null);

    const [translateX, setTranslateX] = useState(() => {
        const saved = localStorage.getItem(SCROLL_KEY);
        return saved ? parseInt(saved, 10) : 0;
    });

    const [isScrollEnd, setIsScrollEnd] = useState(false);
    const scrollStep = 400;

    const sortedCastCredits = useMemo(() => {
        if (castCredits?.cast) {
            const uniqueMedia = new Map();
            castCredits.cast.forEach((media) => {
                if (!uniqueMedia.has(media.id) && media.vote_count > 50) {
                    uniqueMedia.set(media.id, media);
                }
            });
            return [...uniqueMedia.values()].sort(
                (a, b) => b.vote_average - a.vote_average
            );
        }
        return [];
    }, [castCredits]);

    // Save scroll position on change
    useEffect(() => {
        localStorage.setItem(SCROLL_KEY, translateX);
    }, [translateX]);

    const updateScrollEnd = useCallback(() => {
        if (!wrapperRef.current || !containerRef.current) return;

        const contentWidth = wrapperRef.current.offsetWidth;
        const containerWidth = containerRef.current.offsetWidth;
        setIsScrollEnd(translateX <= -(contentWidth - containerWidth));
    }, [translateX]);

    useEffect(() => {
        updateScrollEnd();
    }, [translateX, updateScrollEnd]);

    useEffect(() => {
        // Restore scroll position on mount
        const savedX = parseInt(localStorage.getItem(SCROLL_KEY), 10);
        if (!isNaN(savedX)) {
            setTranslateX(savedX);
        }
    }, []);

    const scrollTo = useCallback((offset) => {
        requestAnimationFrame(() => {
            setTranslateX((prev) => {
                const containerWidth = containerRef.current.offsetWidth;
                const contentWidth = wrapperRef.current.offsetWidth;
                const maxScroll = -(contentWidth - containerWidth);

                const newTranslateX = Math.max(Math.min(prev + offset, 0), maxScroll);
                return newTranslateX;
            });
        });
    }, []);

    const scrollLeft = () => scrollTo(scrollStep);
    const scrollRight = () => scrollTo(-scrollStep);

    return (
        <div className="media-scroller-inner" ref={containerRef}>
            <div className="cast-scroller-inner">
                <div
                    className="shadow-overlay shadow-overlay-start"
                    style={{ opacity: translateX !== 0 ? 1 : 0 }}
                >
                    <PreviousButton
                        className="carouselBtns prevBtn"
                        onClick={scrollLeft}
                        disabled={translateX === 0}
                    />
                </div>
                <div
                    className="media-scroller-wrapper"
                    ref={wrapperRef}
                    style={{
                        transform: `translateX(${translateX}px)`,
                        transition: 'transform 0.4s ease-out'
                    }}
                >
                    {sortedCastCredits.map((media) => (
                        <MediaItem media={media} key={media.id} />
                    ))}
                </div>
                <div
                    className="shadow-overlay shadow-overlay-end"
                    style={{
                        opacity: !isScrollEnd ? 1 : 0
                    }}
                >
                    <NextButton
                        className="carouselBtns nextBtn"
                        onClick={scrollRight}
                        disabled={isScrollEnd}
                    />
                </div>
            </div>
        </div>
    );
}
