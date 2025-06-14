import { useState, useEffect } from 'react';
import { useQueries } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import useFetchStore from '../stores/fetchStore';
import useNavStore from '../stores/navStore';

export default function ResultsPage() {
    const { fetchMovieQueries, fetchShowsQueries } = useFetchStore();
    const { query } = useNavStore();
    const [results, setResults] = useState([]); // State to hold search results

    const queries = [
        {
            queryKey: ['movieQueries', query],
            queryFn: () => fetchMovieQueries(query),
            enabled: !!query
        },
        {
            queryKey: ['showsQueries', query],
            queryFn: () => fetchShowsQueries(query),
            enabled: !!query
        }
    ];

    const queryResults = useQueries({ queries });

    const queryLoading = queryResults.some((result) => result.isLoading);
    const queryError = queryResults.find((result) => result.error)?.error;

    // Handle search submission
    useEffect(() => {
        const movieData = queryResults[0].data || [];
        const showsData = queryResults[1].data || [];

        if (movieData.length > 0 || showsData.length > 0) {
            setResults([...movieData, ...showsData]);
        }
    }, []);

    // Sort results based on rating
    const sortedResults = results
        ? results.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0))
        : [];

    return (
        <div className="search-page-container">
            {queryLoading ? (
                <p className="loading-message">Loading...</p>
            ) : queryError ? (
                <p className="error-message">Error: {queryError.message}</p>
            ) : (
                <div className="results-container">
                    {sortedResults.length > 0 ? (
                        sortedResults.map((item) => {
                            const mediaType = item.name ? 'shows' : 'movie';
                            const title = mediaType === 'movie' ? item.title : item.name;
                            const imageUrl = item?.poster_path
                                ? `https://image.tmdb.org/t/p/w500${item.poster_path}`
                                : null;

                            return (
                                <Link
                                    to={`/${mediaType}/${item.id}`}
                                    className="result-item-container"
                                    key={item.id}
                                >
                                    <div className="poster">
                                        {imageUrl && <img src={imageUrl} alt={title} />}
                                    </div>
                                    <div className="right-side">
                                        <div className="heading">
                                            <p className="title">{title}</p>
                                            <div className="rating">
                                                {item.vote_average.toFixed(1)}
                                            </div>
                                        </div>
                                        <div className="card-detail">
                                            <p>
                                                {mediaType === 'movie' ? (
                                                    <>
                                                        Movies
                                                        <span className="separator">
                                                            {' '}
                                                            •{' '}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <>
                                                        Shows
                                                        <span className="separator">
                                                            {' '}
                                                            •{' '}
                                                        </span>
                                                    </>
                                                )}
                                                {item.release_date?.slice(0, 4) ||
                                                    item.first_air_date?.slice(0, 4)}
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    ) : (
                        <p className="no-results-message">
                            No results found for &quot;{query}&quot;
                        </p>
                    )}
                </div>
            )}
        </div>
    ); // <-- Added missing closing parenthesis here
}
