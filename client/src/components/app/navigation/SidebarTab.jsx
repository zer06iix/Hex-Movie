/* eslint-disable react/prop-types */
import { Link } from 'react-router-dom';
import useNavStore from '../../../stores/navStore';

export default function SidebarTab({ path, children, onClick }) {
    const { activeTab, handleActiveTab } = useNavStore();
    const isActive = activeTab === children;

    const handleClick = (e) => {
        e.stopPropagation(); // Prevent the event from bubbling up
        console.log(`SidebarTab clicked: ${children}`);
        handleActiveTab(children);
        onClick();
    };

    return (
        <Link
            to={path}
            onClick={handleClick}
            className={`sidebar-nav-links ${isActive ? 'active' : 'inactive'}`}
        >
            {children}
        </Link>
    );
}
