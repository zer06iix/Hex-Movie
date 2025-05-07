/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useEffect } from 'react';
import useNavStore from '../../../stores/navStore';

export default function NavIndicator({ width }) {
    const { activeTab, activeTabIndex: i, tabWidths } = useNavStore();

    useEffect(() => {
        // This will trigger a re-render when activeTab changes
    }, [activeTab]);

    if (activeTab === null) return null;

    const indicatorOffset = -20;
    const tabWidth = tabWidths[i] || 0;
    const tabWidthOffset = tabWidths.slice(0, i).reduce((acc, width) => acc + width, 0);

    return (
        <div
            className="nav-indicator"
            style={{
                width: tabWidth + indicatorOffset * 2,
                transform: `translate(
                calc(${i} * 30px + ${tabWidthOffset}px + ${-indicatorOffset}px),
                calc(-50% - 50px)
                )`
            }}
        ></div>
    );
}
