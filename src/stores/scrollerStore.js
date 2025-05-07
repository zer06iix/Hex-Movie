import { create } from 'zustand';

const useScrollerStore = create((set) => ({
    // scrollStep: 600,
    // scrollDelay: 500,

    translateX: 0,
    setTranslateX: (newTranslateX) => set({ translateX: newTranslateX }),

    isScrolling: false,
    setIsScrolling: (boolean) => set({ isScrolling: boolean }),

    isScrollEnd: true,
    setIsScrollEnd: (boolean) => set({ isScrollEnd: boolean }),

    isInitialLoad: true,
    setIsInitialLoad: (boolean) => set({ isInitialLoad: boolean })
}));

export default useScrollerStore;
