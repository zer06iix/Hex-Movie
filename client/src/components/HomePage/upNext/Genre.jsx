/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import useFetchStore from '../../../stores/fetchStore';
import useMovieStore from '../../../stores/movieStore';

export default function Genre({ genreIds }) {
    const { fetchGenresMap } = useFetchStore();
    const { genresMap, setGenresMap } = useMovieStore();

    const {
        data: genresData,
        error: genresError,
        isLoading: genresLoading
    } = useQuery({
        queryKey: ['genresMap'],
        queryFn: fetchGenresMap
    });

    useEffect(() => {
        if (genresData) {
            setGenresMap(genresData);
        }
    }, [genresData, setGenresMap]);

    useEffect(() => {
        if (genresError) {
            console.error('Error fetching genres:', genresError);
        }
    }, [genresError]);

    if (genresLoading) {
        return <div>Loading genres...</div>; // Show loading state
    }

    const mediaGenres =
        genreIds && genreIds.length > 0 ? (
            genreIds.slice(0, 3).map((id) => (
                <div className="genres-item" key={id}>
                    {genresMap[id] || 'Unknown Genre'}
                </div>
            ))
        ) : (
            <div>No genres available</div>
        );

    return <>{mediaGenres}</>;
}
