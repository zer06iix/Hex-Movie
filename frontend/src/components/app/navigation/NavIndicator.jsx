import { useEffect, useState } from 'react';
import useNavStore from '../../../stores/navStore';

export default function NavIndicator() {
    const { activeTab, activeTabIndex: i, tabWidths } = useNavStore();

    const indicatorOffset = -20;
    const tabWidth = tabWidths[i] || 0;
    const tabWidthOffset = tabWidths.slice(0, i).reduce((acc, width) => acc + width, 0);

    // Save only i and offset, not width
    const [lastPosition, setLastPosition] = useState({
        i: 0,
        tabWidthOffset: 0
    });

    useEffect(() => {
        if (activeTab !== null) {
            setLastPosition({
                i,
                tabWidthOffset
            });
        }
    }, [activeTab, i, tabWidthOffset]);

    const currentI = activeTab === null ? lastPosition.i : i;
    const currentOffset =
        activeTab === null ? lastPosition.tabWidthOffset : tabWidthOffset;

    return (
        <div
            className="nav-indicator"
            style={{
                width: tabWidth + indicatorOffset * 2, // stay live
                transform: `translate(
                    calc(${currentI} * 30px + ${currentOffset}px + ${-indicatorOffset}px),
                    ${activeTab === null ? 'calc(-50% - 65px)' : 'calc(-50% - 50px)'}
                )`,
                transition: 'transform 0.3s ease, width 0.3s ease'
            }}
        ></div>
    );
}
