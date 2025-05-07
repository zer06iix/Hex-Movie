/* eslint-disable no-unused-vars */
import { useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';

import Loading from '../components/app/Loading';
import MediaCarousel from '../components/homePage/imageCarousel/MediaCarousel';
import UpNextSection from '../components/homePage/upNext/UpNextSection';
import NavigationMenu from '../components/HomePage/NavigationMenu';

import useFetchStore from '../stores/fetchStore';
import useMovieStore from '../stores/movieStore';
import useShowStore from '../stores/showStore';
import useNavigationMenuStore from '../stores/navigationMenuStore';

export default function Home() {
    const {
        fetchPopularMovies,
        fetchTrendingMovies,
        fetchPopularShows,
        fetchTrendingShows,
        fetchUpcomingMovies, // Add fetchUpcomingMovies
        fetchUpcomingShows, // Add fetchUpcomingShows
        fetchShowsDetails
    } = useFetchStore();

    const { popularMovies, setPopularMovies, trendingMovies, setTrendingMovies } =
        useMovieStore();

    const { popularShows, setPopularShows, trendingShows, setTrendingShows } =
        useShowStore();

    const { selectedIndex } = useNavigationMenuStore();

    const carouselWrapperRef = useRef(null);
    const upNextWrapperRef = useRef(null);

    const {
        data: popularMoviesData,
        error: popularMoviesError,
        isLoading: isPopularMoviesLoading
    } = useQuery({
        queryKey: ['popularMovies'],
        queryFn: () => fetchPopularMovies()
    });

    const {
        data: trendingMoviesData,
        error: trendingMoviesError,
        isLoading: isTrendingMoviesLoading
    } = useQuery({
        queryKey: ['trendingMovies'],
        queryFn: () => fetchTrendingMovies()
    });

    const {
        data: popularShowsData,
        error: popularShowsError,
        isLoading: isPopularShowsLoading
    } = useQuery({
        queryKey: ['popularShows'],
        queryFn: () => fetchPopularShows()
    });

    const {
        data: trendingShowsData,
        error: trendingShowsError,
        isLoading: isTrendingShowsLoading
    } = useQuery({
        queryKey: ['trendingShows'],
        queryFn: () => fetchTrendingShows()
    });

    // Fetch upcoming releases
    const {
        data: upcomingMoviesData,
        error: upcomingMoviesError,
        isLoading: isUpcomingMoviesLoading
    } = useQuery({
        queryKey: ['upcomingMovies'],
        queryFn: () => fetchUpcomingMovies()
    });

    const {
        data: upcomingShowsData,
        error: upcomingShowsError,
        isLoading: isUpcomingShowsLoading
    } = useQuery({
        queryKey: ['upcomingShows'],
        queryFn: () => fetchUpcomingShows()
    });

    // Update stores when data changes
    useEffect(() => {
        if (popularMoviesData && popularMoviesData !== popularMovies) {
            setPopularMovies(popularMoviesData);
        }
        if (trendingMoviesData && trendingMoviesData !== trendingMovies) {
            setTrendingMovies(trendingMoviesData);
        }
        if (popularShowsData && popularShowsData !== popularShows) {
            setPopularShows(popularShowsData);
        }
        if (trendingShowsData && trendingShowsData !== trendingShows) {
            setTrendingShows(trendingShowsData);
        }
    }, [
        popularMoviesData,
        trendingMoviesData,
        popularShowsData,
        trendingShowsData,
        popularMovies,
        trendingMovies,
        popularShows,
        trendingShows,
        setPopularMovies,
        setTrendingMovies,
        setPopularShows,
        setTrendingShows
    ]);

    // Determine the current navigations based on selectedIndex
    let navigations = [];
    switch (selectedIndex) {
        case 0:
            navigations = trendingMovies;
            break;
        case 1:
            navigations = trendingShows;
            break;
        case 2:
            navigations = popularMovies;
            break;
        case 3:
            navigations = popularShows;
            break;
        case 4:
            navigations = upcomingMoviesData; // For upcoming movies
            break;
        case 5:
            navigations = upcomingShowsData; // For upcoming shows
            break;
        default:
            navigations = [];
            break;
    }

    // Fetch additional details for TV shows
    const tvShowIds = navigations
        .filter((media) => media.media_type === 'tv' && media.id) // Ensure ID exists
        .map((media) => media.id);

    const {
        data: tvShowDetails,
        isLoading: isLoadingTvShowDetails,
        error: tvShowDetailsError
    } = useQuery({
        queryKey: ['tvShowDetails', tvShowIds.join(',')],
        queryFn: () => Promise.all(tvShowIds.map((id) => fetchShowsDetails(id))),
        enabled: tvShowIds.length > 0 // Only fetch if there are TV show IDs
    });

    // Merge additional details into navigations
    const enhancedNavigations = navigations.map((media) => {
        if (media.media_type === 'tv') {
            const details = tvShowDetails?.find((detail) => detail.id === media.id);
            return { ...media, ...details }; // Merge additional details
        }
        return media; // Return unchanged for movies
    });

    // Combine loading and error states
    const isLoading =
        isPopularMoviesLoading ||
        isTrendingMoviesLoading ||
        isPopularShowsLoading ||
        isTrendingShowsLoading ||
        isUpcomingMoviesLoading ||
        isUpcomingShowsLoading ||
        isLoadingTvShowDetails;
    const error =
        popularMoviesError ||
        trendingMoviesError ||
        popularShowsError ||
        trendingShowsError ||
        upcomingMoviesError ||
        upcomingShowsError ||
        tvShowDetailsError;

    if (isLoading) {
        return <Loading />;
    }

    if (error) {
        return (
            <div className="error-container">
                <div className="error-details-wrapper">
                    <p className="title">{`An Error occurred :(`}</p>
                    <p className="description">Error: {error.message}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <NavigationMenu />
            <MediaCarousel
                media={enhancedNavigations}
                wrapperRef={carouselWrapperRef}
                upNextWrapperRef={upNextWrapperRef}
                selectedIndex={selectedIndex}
            />
            <UpNextSection media={enhancedNavigations} wrapperRef={upNextWrapperRef} />
        </>
    );
}
