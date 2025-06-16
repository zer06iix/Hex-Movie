import { create } from 'zustand';

// const [lastViewportWidth, setLastViewportWidth] = useState(window.innerWidth);
// const [showExpanderBtn, setShowExpanderBtn] = useState(true);
// const [showOverview, setShowOverview] = useState(true);
// const [isExpanded, setIsExpanded] = useState(false);
// const [lastVisibleWidth, setLastVisibleWidth] = useState(null);

const useContentStore = create((set) => ({
    lastViewportWidth: window.innerWidth,
    setLastViewportWidth: (newLastViewportWidth) =>
        set({ lastViewportWidth: newLastViewportWidth }),

    lastVisibleWidth: null,
    setLastVisibleWidth: (newLastVisibleWidth) =>
        set({ lastVisibleWidth: newLastVisibleWidth }),

    showExpanderBtn: true,
    setShowExpanderBtn: (boolean) => set({ showExpanderBtn: boolean }),

    showExpandable: true,
    setShowExpandable: (boolean) => set({ showExpandable: boolean }),

    isExpanded: false,
    setIsExpanded: (boolean) => set({ isExpanded: boolean })
}));

export default useContentStore;
