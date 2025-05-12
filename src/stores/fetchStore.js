/* eslint-disable no-unused-vars */
import { create } from 'zustand';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../api/tmdb';

// Utility function to create API URLs
const createApiUrl = (endpoint) => `${BASE_URL}${endpoint}?api_key=${API_KEY}`;
// Utility function to create API URLs with their query
const createApiUrlWithQueryParams = (endpoint, queryParams) => {
    const queryString = new URLSearchParams({
        api_key: API_KEY,
        ...queryParams
    }).toString();
    return `${BASE_URL}${endpoint}?${queryString}`;
};

const useFetchStore = create((set) => ({
    fetchPopularMovies: async () => {
        console.log('Fetching popular movies'); // Log when fetching starts
        const url = createApiUrl('/movie/popular');
        const response = await axios.get(url);
        const movies = response.data.results;
        return movies; // Ensure this is returning an array
    },
    fetchPopularShows: async () => {
        console.log('Fetching popular shows'); // Log when fetching starts
        const url = createApiUrlWithQueryParams('/tv/popular');
        const response = await axios.get(url);
        const movies = response.data.results;
        return movies; // Ensure this is returning an array
    },

    // Movie page
    fetchMovieDetails: async (id) => {
        console.log(`Fetching movie details.`);
        const url = createApiUrl(`/movie/${id}`);
        const response = await axios.get(url);
        console.log('Movie details got fetched');
        return response.data; // Return the movie details
    },

    fetchMovieCredits: async (id) => {
        const url = createApiUrl(`/movie/${id}/credits`);
        const response = await axios.get(url);
        return response.data;
    },

    // Shows page
    fetchShowsDetails: async (id) => {
        console.log(`Fetching tv details.`);
        const url = createApiUrl(`/tv/${id}`);
        const response = await axios.get(url);
        console.log('Shows details got fetched');
        return response.data; // Return the movie details
    },

    fetchShowsCredits: async (id) => {
        const url = createApiUrl(`/tv/${id}/credits`);
        const response = await axios.get(url);
        return response.data;
    },

    fetchGenres: async () => {
        // New function to fetch genres
        try {
            console.log('Fetching genres');
            const url = createApiUrl(`/genre/list`);
            const response = await axios.get(url);
            console.log('MovieGenres fetched successfully');
            return response.data.genres; // Return the genres
        } catch (error) {
            console.error('Error fetching genres:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },

    fetchGenresMap: async () => {
        // New function to fetch genres and transform them into a map
        try {
            const genres = await useFetchStore.getState().fetchGenres(); // Fetch genres
            const genresMap = genres.reduce((accumulator, { id, name }) => {
                accumulator[id] = name;
                return accumulator;
            }, {});
            return genresMap; // Return the genres map
        } catch (error) {
            console.error('Error fetching genres map:', error);
            throw error; // Rethrow the error for handling in the calling function
        }
    },

    fetchSearchQueries: async (query) => {
        const url = createApiUrlWithQueryParams(`/search/multi`, { query: query });
        const response = await axios.get(url);

        return response.data.results;
    },

    fetchMovieQueries: async (query) => {
        const url = createApiUrlWithQueryParams(`/search/movie`, { query: query });
        const response = await axios.get(url);

        return response.data.results;
    },

    fetchShowsQueries: async (query) => {
        const url = createApiUrlWithQueryParams(`/search/tv`, { query: query });
        const response = await axios.get(url);

        return response.data.results;
    },

    // Shows actor/actress biography
    fetchCastDetails: async (id) => {
        const url = createApiUrl(`/person/${id}`);
        const response = await axios.get(url);

        return response.data;
    },

    // Shows actor/actress movies they played
    fetchCastCredits: async (id) => {
        const url = createApiUrl(`/person/${id}/combined_credits`);
        const response = await axios.get(url);

        return response.data;
    },

    fetchTrendingMovies: async () => {
        const url = createApiUrl('/trending/movie/week'); // This will show the trending of the week (Or can be day instead of week)
        const response = await axios.get(url);

        return response.data.results;
    },
    fetchTrendingShows: async () => {
        const url = createApiUrl('/trending/tv/week'); // This will show the trending of the week (Or can be day instead of week)
        const response = await axios.get(url);

        return response.data.results;
    },

    fetchUpcomingMovies: async () => {
        const url = createApiUrl('/movie/upcoming');
        const response = await axios.get(url);
        return response.data.results;
    },

    fetchAiringShows: async () => {
        const url = createApiUrl('/tv/airing_today');
        const response = await axios.get(url);
        return response.data.results;
    },

    fetchMovieRecommendations: async (id) => {
        const url = createApiUrl(`/movie/${id}/recommendations`);
        const response = await axios.get(url);

        return response.data;
    }
}));

export default useFetchStore;
