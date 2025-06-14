import { create } from 'zustand';

const useMovieStore = create((set) => ({
    movie: null, // Movie details on the movie page
    setMovie: (movieDetails) => set({ movie: movieDetails }),

    trendingMovies: [],
    setTrendingMovies: (movies) => set({ trendingMovies: movies }),

    popularMovies: [], // State to hold popular movies
    setPopularMovies: (movies) => set({ popularMovies: movies }),

    movieCredits: [],
    setCredits: (movieCredit) => set({ movieCredits: movieCredit }),

    genresMap: {}, //State to hold genres
    setGenresMap: (genres) => set({ genresMap: genres })
}));

export default useMovieStore;
