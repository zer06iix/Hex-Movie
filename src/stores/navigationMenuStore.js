import { create } from 'zustand';

const useNavigationMenuStore = create((set) => ({
    selectedIndex: (() => {
        if (typeof window === 'undefined') return 0;
        const saved = sessionStorage.getItem('selectedIndex');
        // Validate the stored value is within expected range (0-5)
        return saved && [0,1,2,3,4,5].includes(Number(saved)) 
            ? Number(saved) 
            : 0;
    })(),
    setSelectedIndex: function(newSelectedIndex) {
        if (typeof window !== 'undefined') {
            // Only store valid indices
            if ([0,1,2,3,4,5].includes(newSelectedIndex)) {
                sessionStorage.setItem('selectedIndex', String(newSelectedIndex));
            }
        }
        set({ selectedIndex: newSelectedIndex });
    }
}));

export default useNavigationMenuStore;