import { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import NextButton from '../buttons/NextButton';
import PreviousButton from '../buttons/PreviousButton';

export default function HorizontalCarousel({
    items,
    renderItem,
    scrollStep = 300,
    scrollId,
    componentName = 'HorizontalCarousel'
}) {
    const wrapperRef = useRef(null);
    const containerRef = useRef(null);
    const itemRefs = useRef([]);

    const [translateX, setTranslateX] = useState(0);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const fullScrollKey = scrollId
        ? `carousel-scroll::${componentName}::${scrollId}`
        : null;

    useEffect(() => {
        if (!fullScrollKey) return;
        const saved = localStorage.getItem(fullScrollKey);
        if (saved !== null) setTranslateX(parseInt(saved, 10));
    }, [fullScrollKey]);

    useEffect(() => {
        if (fullScrollKey) localStorage.setItem(fullScrollKey, translateX);
        updateScrollBounds();
    }, [translateX, items, fullScrollKey]);

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
            <div
                className="carousel-shadow shadow-left"
                style={{ opacity: canScrollLeft ? 1 : 0 }}
            />

            {canScrollLeft && (
                <PreviousButton
                    className="carouselBtns prevBtn"
                    onClick={() => scroll(scrollStep)}
                />
            )}

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

            <div
                className="carousel-shadow shadow-right"
                style={{ opacity: canScrollRight ? 1 : 0 }}
            />

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
    scrollId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    componentName: PropTypes.string
};
