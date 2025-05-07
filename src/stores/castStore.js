import { create } from 'zustand';

const useCastStore = create((set) => ({
    cast: null,
    setCast: (newCast) => set({ cast: newCast }),

    castCredits: [],
    setCastCredits: (castCredit) => set({ castCredits: castCredit })
}));

export default useCastStore;
