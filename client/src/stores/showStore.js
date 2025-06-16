import { create } from 'zustand';

const useShowStore = create((set) => ({
    shows: null, // Shows details on the movie page
    setShows: (showDetails) => set({ shows: showDetails }),

    trendingShows: [],
    setTrendingShows: (shows) => set({ trendingShows: shows }),

    popularShows: [], // State to hold popular shows
    setPopularShows: (shows) => set({ popularShows: shows }),

    showsCredits: [],
    setCredits: (showsCredit) => set({ showsCredits: showsCredit }),

    genresMap: {}, // State to hold genres
    setGenresMap: (genres) => set({ genresMap: genres })
}));

export default useShowStore;
