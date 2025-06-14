import { forwardRef } from 'react';
import useNavStore from '../../stores/navStore';

/* eslint-disable react/prop-types */
const MenuButton = forwardRef(({ style, onClick }, ref) => {
    const { toggleSidebar } = useNavStore();

    const handleClick = () => {
        onClick();
        toggleSidebar();
    };

    return (
        <button ref={ref} onClick={handleClick} className="menu-button" style={style}>
            <svg
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                data-darkreader-inline-stroke=""
                style={{ '--darkreader-inline-stroke': '#e5e2dc' }}
            >
                <path
                    fillRule="evenodd"
                    d="M19 4a1 1 0 01-1 1H2a1 1 0 010-2h16a1 1 0 011 1zm0 6a1 1 0 01-1 1H2a1 1 0 110-2h16a1 1 0 011 1zm-1 7a1 1 0 100-2H2a1 1 0 100 2h16z"
                    data-darkreader-inline-fill=""
                    style={{
                        '--darkreader-inline-fill': '#080b0c'
                    }}
                />
            </svg>
        </button>
    );
});

MenuButton.displayName = 'MenuButton';

export default MenuButton;
