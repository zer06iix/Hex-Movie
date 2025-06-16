import { create } from 'zustand';
import useMovieStore from './movieStore';

const useCarouselStore = create((set) => ({
    currentSlide: 0,
    nextSlide: () => {
        const { popularMovies } = useMovieStore.getState();
        set((state) => ({
            currentSlide: (state.currentSlide + 1) % popularMovies.length
        }));
    },
    prevSlide: () => {
        const { popularMovies } = useMovieStore.getState();
        set((state) => ({
            currentSlide:
                (state.currentSlide - 1 + popularMovies.length) % popularMovies.length
        }));
    }
}));

export default useCarouselStore;
