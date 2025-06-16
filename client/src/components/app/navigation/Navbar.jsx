import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MenuButton from '../../buttons/MenuButton';
import SearchBar from '../searchbar/SearchBar';
import NavIndicator from './NavIndicator';
import NavTab from './NavTab';
import Sidebar from './Sidebar';
import SidebarTab from './SidebarTab';
import useNavStore from '../../../stores/navStore';

export default function Navbar() {
    const location = useLocation();
    const {
        setActiveTabFromLocation,
        isSidebarOpen,
        toggleSidebar,
        menuButtonOpacity,
        setMenuButtonOpacity,
        activeTabWidth,
        setActiveTabWidth
    } = useNavStore();

    const handleSidebarClick = () => setMenuButtonOpacity(1);

    const handleSidebarTabClick = () => {
        setMenuButtonOpacity(1);
        toggleSidebar();
    };

    const handleTabWidthChange = (width) => {
        setActiveTabWidth(width);
    };

    useEffect(() => {
        setActiveTabFromLocation(location);
    }, [location, setActiveTabFromLocation]);

    useEffect(() => {
        const handleResize = () => {
            // Closes the sidebar when it's larger than widthThreshold
            const widthThreshold = 1000; // in px
            if (window.innerWidth > widthThreshold && isSidebarOpen) {
                setMenuButtonOpacity(1);
                toggleSidebar();
            }
        };

        window.addEventListener('resize', handleResize);
        // Cleanup listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isSidebarOpen, toggleSidebar, setMenuButtonOpacity]);

    return (
        <nav>
            <div className="nav-container">
                <div className="navbar-left-section">
                    <MenuButton
                        style={{
                            opacity: menuButtonOpacity
                        }}
                        onClick={() => setMenuButtonOpacity(0)}
                    />

                    <div className="nav-links-container">
                        <NavIndicator width={activeTabWidth} />

                        <NavTab path="/" onTabWidthChange={handleTabWidthChange}>
                            Home
                        </NavTab>

                        <NavTab
                            path="/most-rated"
                            onTabWidthChange={handleTabWidthChange}
                        >
                            Most Rated
                        </NavTab>

                        <NavTab path="/watchlist" onTabWidthChange={handleTabWidthChange}>
                            Watch list
                        </NavTab>
                    </div>
                </div>

                <SearchBar />
            </div>

            {isSidebarOpen && ( // Render Sidebar only if it's open
                <Sidebar onClick={handleSidebarClick}>
                    <SidebarTab path="/" onClick={handleSidebarTabClick}>
                        Home
                    </SidebarTab>
                    <SidebarTab path="/most-rated" onClick={handleSidebarTabClick}>
                        Most Rated
                    </SidebarTab>
                    <SidebarTab path="/watchlist" onClick={handleSidebarTabClick}>
                        Watch list
                    </SidebarTab>
                </Sidebar>
            )}
        </nav>
    );
}
