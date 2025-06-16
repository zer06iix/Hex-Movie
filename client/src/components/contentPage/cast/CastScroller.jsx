import { useRef, useState, useCallback, useEffect } from 'react';
import useMovieStore from '../../../stores/movieStore';
import useShowStore from '../../../stores/showStore';
import CastItem from '../../contentPage/cast/CastItem';

import NextButton from '../../buttons/NextButton';
import PreviousButton from '../../buttons/PreviousButton';

export default function CastScroller() {
    const { movieCredits } = useMovieStore();
    const { shows, showsCredits } = useShowStore();

    const wrapperRef = useRef(null);
    const containerRef = useRef(null);

    const [translateX, setTranslateX] = useState(0);
    const [isScrollEnd, setIsScrollEnd] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const mediaType = shows?.name ? 'shows' : 'movie';

    const scrollStep = 600;
    const scrollDelay = 500;
    const scrollThreshold = 10;

    const scrollLeft = useCallback(() => {
        if (wrapperRef.current && !isScrolling) {
            setIsScrolling(true);
            setTranslateX((prev) => Math.min(0, prev + scrollStep));
            setTimeout(() => setIsScrolling(false), scrollDelay);
        }
    }, [isScrolling]);

    const scrollRight = useCallback(() => {
        if (wrapperRef.current && containerRef.current && !isScrolling) {
            setIsScrolling(true);
            const containerWidth = containerRef.current.offsetWidth;
            const contentWidth = wrapperRef.current.offsetWidth;
            setTranslateX((prev) =>
                Math.max(-(contentWidth - containerWidth), prev - scrollStep)
            );
            setTimeout(() => setIsScrolling(false), scrollDelay);
        }
    }, [isScrolling]);

    // Reset scroll position on media change
    useEffect(() => {
        setTranslateX(0);
    }, [movieCredits?.id, shows?.id]);

    // Recalculate scroll end when translateX changes
    useEffect(() => {
        if (wrapperRef.current && containerRef.current) {
            const contentWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            setIsScrollEnd(
                translateX <= -(contentWidth - containerWidth - scrollThreshold)
            );
        }
    }, [translateX]);

    // Recalculate scrollability when cast list or window size changes
    const castList = mediaType === 'movie' ? movieCredits?.cast : showsCredits?.cast;

    useEffect(() => {
        const handleResizeOrContentChange = () => {
            if (wrapperRef.current && containerRef.current) {
                const contentWidth = wrapperRef.current.offsetWidth;
                const containerWidth = containerRef.current.offsetWidth;
                const canScrollRight = contentWidth - containerWidth > scrollThreshold;
                setIsScrollEnd(!canScrollRight);
            }
        };

        handleResizeOrContentChange();
        window.addEventListener('resize', handleResizeOrContentChange);
        return () => window.removeEventListener('resize', handleResizeOrContentChange);
    }, [castList]);

    const canScrollRight =
        wrapperRef.current &&
        containerRef.current &&
        translateX >
            -(
                wrapperRef.current.offsetWidth -
                containerRef.current.offsetWidth -
                scrollThreshold
            );

    const canScrollLeft = translateX < 0;

    return (
        <div className="cast-scroller-container" ref={containerRef}>
            <div className="cast-scroller-inner">
                <div
                    className="shadow-overlay shadow-overlay-start"
                    style={{
                        opacity: canScrollLeft ? 1 : 0,
                        pointerEvents: canScrollLeft ? 'auto' : 'none'
                    }}
                >
                    <PreviousButton
                        className="carouselBtns prevBtn"
                        onClick={scrollLeft}
                        disabled={!canScrollLeft}
                    />
                </div>

                <div
                    className="cast-scroller-wrapper"
                    ref={wrapperRef}
                    style={{
                        transform: `translateX(${translateX}px)`,
                        transition: 'transform 0.5s ease-in-out'
                    }}
                >
                    {castList?.length
                        ? castList.map((member) => (
                              <CastItem member={member} key={member.id} />
                          ))
                        : null}
                </div>

                <div
                    className="shadow-overlay shadow-overlay-end"
                    style={{
                        opacity: canScrollRight ? 1 : 0,
                        pointerEvents: canScrollRight ? 'auto' : 'none'
                    }}
                >
                    <NextButton
                        className="carouselBtns nextBtn"
                        onClick={scrollRight}
                        disabled={!canScrollRight}
                    />
                </div>
            </div>
        </div>
    );
}
