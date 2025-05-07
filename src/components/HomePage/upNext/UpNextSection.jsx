/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import useCarouselStore from '../../../stores/carouselStore';
import useFetchStore from '../../../stores/fetchStore';
import UpNextItem from './UpNextItem';
import { useQuery } from '@tanstack/react-query';

export default function UpNextSection({ media, wrapperRef }) {
    const [itemsToLoad, setItemsToLoad] = useState(5);
    const [opacities, setOpacities] = useState([]);
    const { currentSlide } = useCarouselStore();
    const { fetchGenresMap } = useFetchStore();

    const {
        data: genresData,
        error: genresError,
        isLoading: genresLoading
    } = useQuery({
        queryKey: ['genresMap'],
        queryFn: fetchGenresMap
    });

    useEffect(() => {
        if (genresError) {
            console.error('Error fetching genres:', genresError);
        }
    }, [genresError]);

    // Calculate the items to load count based on vh
    const calculateItemsToLoad = () => {
        const leastItems = 2;
        const mostItems = 5;
        const staticOffset = 166 + 100; // navbar height & etc.
        const itemHeight = 120;
        const calculatedItems = Math.floor(
            (window.innerHeight - staticOffset) / itemHeight
        );
        setItemsToLoad(Math.max(leastItems, Math.min(calculatedItems, mostItems)));
        setOpacities(Array.from({ length: calculatedItems + 2 }, () => 1));
    };

    useEffect(() => {
        calculateItemsToLoad();

        window.addEventListener('resize', calculateItemsToLoad);

        return () => {
            window.removeEventListener('resize', calculateItemsToLoad);
        };
    }, []);

    return (
        <div className="up-next-container">
            <p className="up-next-title">Up Next</p>
            <div className="up-next-mask" style={{ height: `${itemsToLoad * 120}px` }}>
                <div className="up-next-wrapper" ref={wrapperRef}>
                    {genresLoading ? (
                        <p>Loading genres...</p>
                    ) : (
                        Array.from({ length: itemsToLoad + 2 }, (_, i) => {
                            const movieIndex = currentSlide + i;
                            const adjustedIndex =
                                (movieIndex + media.length) % media.length;
                            const movie = media[adjustedIndex];
                            if (!movie) return null;
                            const translateY = ((itemsToLoad + 1) / 2 - i) * -100 - 50;
                            return (
                                <UpNextItem
                                    key={i}
                                    media={movie}
                                    index={i}
                                    genresData={genresData}
                                    translateY={translateY}
                                    opacity={1}
                                />
                            );
                        })
                    )}
                </div>
            </div>
        </div>
    );
}

UpNextSection.propTypes = {
    media: PropTypes.arrayOf(PropTypes.object).isRequired,
    wrapperRef: PropTypes.object.isRequired
};
