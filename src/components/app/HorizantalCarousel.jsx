import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NextButton from '../buttons/NextButton';
import PreviousButton from '../buttons/PreviousButton';

export default function HorizontalCarousel({
    items,
    renderItem,
    scrollStep = 300,
    scrollKey
}) {
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const itemRefs = useRef([]);

    const [translateX, setTranslateX] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    useEffect(() => {
        if (!scrollKey) return;
        const saved = localStorage.getItem(scrollKey);
        if (saved !== null) setTranslateX(parseInt(saved, 10));
    }, [scrollKey]);

    useEffect(() => {
        if (scrollKey) localStorage.setItem(scrollKey, translateX);
        updateScrollBounds();
    }, [translateX, items, scrollKey]);

    useEffect(() => {
        window.addEventListener('resize', updateScrollBounds);
        return () => window.removeEventListener('resize', updateScrollBounds);
    }, []);

    const updateScrollBounds = () => {
        if (!wrapperRef.current || !containerRef.current) return;
        const contentWidth = wrapperRef.current.scrollWidth;
        const containerWidth = containerRef.current.offsetWidth;

        setCanScrollLeft(translateX < 0);
        setCanScrollRight(Math.abs(translateX) + containerWidth < contentWidth);
    };

    const scroll = (offset) => {
        const container = containerRef.current;
        const currentX = translateX + offset;

        if (!container || !itemRefs.current.length) return;

        const targetX = -currentX;

        // Find closest item whose left is just after targetX
        let closestIndex = 0;
        let minDistance = Infinity;

        itemRefs.current.forEach((item, index) => {
            if (!item) return;
            const itemLeft = item.offsetLeft;
            const distance = Math.abs(itemLeft - targetX);
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = index;
            }
        });

        const itemOffset = itemRefs.current[closestIndex]?.offsetLeft;
        const snapTo = itemOffset != null ? -itemOffset : 0;
        setTranslateX(snapTo);
    };

    return (
        <div className="carousel-container" ref={containerRef}>
            {/* Left Shadow */}
            <div
                className="carousel-shadow shadow-left"
                style={{ opacity: canScrollLeft ? 1 : 0 }}
            />

            {/* Left Button */}
            {canScrollLeft && (
                <PreviousButton
                    className="carouselBtns prevBtn"
                    onClick={() => scroll(scrollStep)}
                />
            )}

            {/* Wrapper */}
            <div
                className="carousel-wrapper"
                ref={wrapperRef}
                style={{
                    transform: `translateX(${translateX}px)`,
                    transition: 'transform 0.3s ease',
                    display: 'flex'
                }}
            >
                {items.map((item, i) => (
                    <div
                        key={item.id || i}
                        className="carousel-item"
                        ref={(el) => (itemRefs.current[i] = el)}
                    >
                        {renderItem(item)}
                    </div>
                ))}
            </div>

            {/* Right Shadow */}
            <div
                className="carousel-shadow shadow-right"
                style={{ opacity: canScrollRight ? 1 : 0 }}
            />

            {/* Right Button */}
            {canScrollRight && (
                <NextButton
                    className="carouselBtns nextBtn"
                    onClick={() => scroll(-scrollStep)}
                />
            )}
        </div>
    );
}

HorizontalCarousel.propTypes = {
    items: PropTypes.arrayOf(PropTypes.object).isRequired,
    renderItem: PropTypes.func.isRequired,
    scrollStep: PropTypes.number,
    scrollKey: PropTypes.string
};
