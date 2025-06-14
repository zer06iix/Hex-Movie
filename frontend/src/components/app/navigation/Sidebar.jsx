/* eslint-disable react/prop-types */
import { useCallback } from 'react';
import useNavStore from '../../../stores/navStore';

export default function Sidebar({ children, onClick }) {
    const { isSidebarOpen, toggleSidebar } = useNavStore();

    const handleClick = useCallback(() => {
        toggleSidebar();
        onClick();
    }, [onClick, toggleSidebar]);

    return (
        <div
            className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}
            onClick={handleClick}
        >
            <div className="sidebar-nav-links-container">{children}</div>
        </div>
    );
}
