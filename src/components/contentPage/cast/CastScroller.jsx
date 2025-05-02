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
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [isScrolling, setIsScrolling] = useState(false);

    const mediaType = shows?.name ? 'shows' : 'movie';

    const scrollStep = 600;
    const scrollDelay = 500;

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

    // Reset scroll on media change
    useEffect(() => {
        setTranslateX(0);
    }, [movieCredits?.id, shows?.id]);

    useEffect(() => {
        if (wrapperRef.current && containerRef.current) {
            setIsInitialLoad(false);
            const contentWidth = wrapperRef.current.offsetWidth;
            const containerWidth = containerRef.current.offsetWidth;
            setIsScrollEnd(translateX <= -(contentWidth - containerWidth));
        }
    }, [translateX]);

    const castList = mediaType === 'movie' ? movieCredits?.cast : showsCredits?.cast;

    return (
        <div className="cast-scroller-container" ref={containerRef}>
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
                        opacity:
                            !isInitialLoad &&
                            wrapperRef.current &&
                            containerRef.current &&
                            translateX >
                                -(
                                    wrapperRef.current.offsetWidth -
                                    containerRef.current.offsetWidth
                                )
                                ? 1
                                : 0
                    }}
                >
                    <NextButton
                        className="carouselBtns nextBtn"
                        onClick={scrollRight}
                        disabled={
                            !isInitialLoad && wrapperRef.current && containerRef.current
                                ? translateX <=
                                  -(
                                      wrapperRef.current.offsetWidth -
                                      containerRef.current.offsetWidth
                                  )
                                : true
                        }
                    />
                </div>
            </div>
        </div>
    );
}
