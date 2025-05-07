import { create } from 'zustand';

const useNavigationMenuStore = create((set) => ({
    selectedIndex: 0,
    setSelectedIndex: (newSelectedIndex) => set({ selectedIndex: newSelectedIndex })
}));

export default useNavigationMenuStore;
