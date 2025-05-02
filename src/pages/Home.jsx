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
        fetchShowsDetails // Fetch additional details for TV shows
    } = useFetchStore();

    const { popularMovies, setPopularMovies, trendingMovies, setTrendingMovies } =
        useMovieStore();

    const { popularShows, setPopularShows, trendingShows, setTrendingShows } =
        useShowStore();

    const { selectedIndex } = useNavigationMenuStore();

    const carouselWrapperRef = useRef(null); // Ref for carousel wrapper
    const upNextWrapperRef = useRef(null); // Ref for up-next section

    // Fetch initial data (movies and shows)
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
        isLoadingTvShowDetails;
    const error =
        popularMoviesError ||
        trendingMoviesError ||
        popularShowsError ||
        trendingShowsError ||
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
            />
            <UpNextSection media={enhancedNavigations} wrapperRef={upNextWrapperRef} />
        </>
    );
}
