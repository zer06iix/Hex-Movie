/* eslint-disable react/prop-types */
import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import useNavStore from '../../../stores/navStore';

export default function NavTab({ path, children }) {
    const { activeTab, handleActiveTab, updateTabWidth, tabs } = useNavStore();
    const isActive = activeTab === children;
    const tabRef = useRef(null);
    const tabIndex = tabs.indexOf(children); // Find the index of this tab

    useEffect(() => {
        if (tabRef.current) {
            const width = tabRef.current.getBoundingClientRect().width;
            updateTabWidth(tabIndex, width); // Update the tab's width in the store
        }
    }, [tabIndex, updateTabWidth]);

    return (
        <Link
            ref={tabRef}
            to={path}
            onClick={() => handleActiveTab(children)}
            className={`nav-links ${isActive ? 'active' : 'inactive'}`}
        >
            {children}
        </Link>
    );
}
