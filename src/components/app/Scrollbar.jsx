/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import { useEffect, useRef, useState } from 'react';

// Configuration object with default settings
const DEFAULT_CONFIG = {
    enableArrowBtns: true,
    arrowBtnsColor: 'red',
    arrowBtnsLength: 20, //px
    hideArrowBtnsWhenInactive: true,
    arrowBtnsToggleDelay: 800, //ms
    trackThickness: 20,
    thumbThickness: 20
};

function CustomScrollbar({
    x = false,
    y = false,
    contentRef, // For the scrollbar track, this is unchanged.
    scrollableRef, // New prop: The ref or element we want to scroll
    config = {},
    scrollOffset = 0
}) {
    // Merge default config with user-provided config
    const scrollConfig = { ...DEFAULT_CONFIG, ...config };

    // State variables
    const [isActive, setIsActive] = useState(true); // Tracks if the scrollbar is active
    const [thumbPosition, setThumbPosition] = useState(0); // Position of the scrollbar thumb
    const [isDragging, setIsDragging] = useState(false); // Tracks if the thumb is being dragged
    const [dragOffset, setDragOffset] = useState(0); //Offset from the click position
    const [contentHeight, setContentHeight] = useState(0); // Height of the content
    const [viewportSize, setViewportSize] = useState({ width: 0, height: 0 }); // Viewport dimensions
    const [contentWidth, setContentWidth] = useState(0); // Width of the content
    const [viewportWidth, setViewportWidth] = useState(0); // Width of the viewport
    const [heightProportion, setHeightProportion] = useState(0); // Proportion of height
    const [thumbLength, setThumbLength] = useState(0); // set the thumb size
    const [scrollPosition, setScrollPosition] = useState(0); // Current scroll position

    // Refs for DOM elements
    const trackRef = useRef(null); // Ref to the scrollbar track element
    const thumbRef = useRef(null); // Ref to the scrollbar thumb element

    // Get the scrollable element
    const scrollableElement = scrollableRef?.current || document.body;

    useEffect(() => {
        document.documentElement.style.setProperty(
            '--arrow-btns-length',
            `${scrollConfig.arrowBtnsLength}px`
        );
    }, [scrollConfig.arrowBtnsLength]);

    //  Handle mouse down event on the thumb
    const handleMouseDown = (e) => {
        setIsDragging(true);
        e.preventDefault();
        if (trackRef.current && thumbRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();
            const thumbRect = thumbRef.current.getBoundingClientRect();

            let initialOffset;
            if (x) {
                initialOffset = e.clientX - trackRect.left - thumbPosition;
            } else if (y) {
                initialOffset = e.clientY - trackRect.top - thumbPosition;
            }
            if (initialOffset !== undefined) setDragOffset(initialOffset);
        }
    };

    // Handle mouse move event during dragging
    const handleMouseMove = (e) => {
        if (!isDragging) return;

        if (trackRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();

            let newPosition;
            if (x) {
                const mouseX = e.clientX - trackRect.left;
                const maxPosition = trackRect.width - thumbLength;
                newPosition = Math.min(Math.max(0, mouseX - dragOffset), maxPosition);
            } else if (y) {
                const mouseY = e.clientY - trackRect.top;
                const maxPosition = trackRect.height - thumbLength;
                newPosition = Math.min(Math.max(0, mouseY - dragOffset), maxPosition);
            }
            if (newPosition !== undefined) {
                setThumbPosition(newPosition);
            }
        }
    };

    // Handle mouse up event to stop dragging
    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Calculate the thumb length on component mount and when x or y change
    useEffect(() => {
        if (trackRef.current && thumbRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();
            const thumbRect = thumbRef.current.getBoundingClientRect();
            if (y) {
                const trackHeight = trackRect.height;
                const maxThumbHeight = trackHeight * (trackHeight / contentHeight);

                setThumbLength(Math.min(trackHeight * 0.5, maxThumbHeight));
                setThumbLength(thumbRect.height);
            } else if (x) {
                const trackWidth = trackRect.width;
                const maxThumbWidth = trackWidth * (trackWidth / contentWidth);

                setThumbLength(Math.min(trackWidth * 0.5, maxThumbWidth));
                setThumbLength(thumbRect.width);
            }
        }
    }, [y, x, contentHeight, contentWidth, heightProportion, thumbRef]);

    // Calculate content and viewport dimensions and listen to resize and content changes
    useEffect(() => {
        // Function to calculate and set dimensions
        const handleResize = () => {
            if (contentRef && contentRef.current) {
                const rect = contentRef.current.getBoundingClientRect();
                setContentHeight(rect.height + scrollOffset);
                setContentWidth(rect.width);
            }
            setViewportWidth(window.innerWidth);
            setViewportSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        // Initial call to set sizes
        handleResize();
        // Set up a resize listener
        window.addEventListener('resize', handleResize);

        let resizeObserver;

        // Set up a resize observer to observe the contentRef
        if (contentRef && contentRef.current) {
            resizeObserver = new ResizeObserver((entries) => {
                for (const entry of entries) {
                    setContentHeight(entry.contentRect.height + scrollOffset);
                    setContentWidth(entry.contentRect.width);
                }
            });
            resizeObserver.observe(contentRef.current);
        }

        // Cleanup function to remove the listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
            if (resizeObserver) resizeObserver.disconnect();
        };
    }, [contentRef, scrollOffset]);

    // Handle the thumb dragging
    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        } else {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Calculate the proportion of the content height vs viewport height
    useEffect(() => {
        if (y && viewportSize.height && contentHeight)
            setHeightProportion((viewportSize.height / contentHeight) * 100);

        if (x && viewportWidth && contentWidth)
            setHeightProportion((viewportWidth / contentWidth) * 100);
    }, [contentHeight, viewportSize.height, contentWidth, viewportWidth, x, y]);

    // Calculate the scroll position based on thumb position
    useEffect(() => {
        if (trackRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();
            let newScrollPosition;
            if (y) {
                const scrollableHeight = contentHeight - viewportSize.height;
                const maxThumbPosition = trackRect.height - thumbLength;

                newScrollPosition = scrollableHeight * (thumbPosition / maxThumbPosition);
            } else if (x) {
                const scrollableWidth = contentWidth - viewportWidth;
                const maxThumbPosition = trackRect.width - thumbLength;

                newScrollPosition = scrollableWidth * (thumbPosition / maxThumbPosition);
            }
            if (newScrollPosition !== undefined) {
                setScrollPosition(newScrollPosition);
            }
        }
    }, [
        thumbPosition,
        contentHeight,
        contentWidth,
        viewportSize.height,
        viewportWidth,
        y,
        x,
        thumbLength
    ]);

    // Apply scroll to content
    useEffect(() => {
        if (scrollableElement) {
            if (y) {
                scrollableElement.scrollTo({
                    top: scrollPosition
                });
            } else if (x) {
                scrollableElement.scrollTo({
                    left: scrollPosition
                });
            }
        }
    }, [scrollPosition, scrollableElement, x, y]);

    // Log content and viewport sizes
    const logSizes = () => {
        if (contentRef && contentRef.current) {
            const rect = contentRef.current.getBoundingClientRect();
            console.log('Content Height:', rect.height);
        }

        console.log('Viewport Height:', viewportSize.height);
        if (trackRef.current) {
            const trackRect = trackRef.current.getBoundingClientRect();
            console.log('Track Height:', trackRect.height);
        }
        console.log('Height Proportion:', heightProportion + '%');
        if (thumbRef.current) {
            const thumbRect = thumbRef.current.getBoundingClientRect();
            console.log('thumb rect height', thumbRect.height);
            console.log('thumb rect width', thumbRect.width);
        }
        console.log('Content width', contentWidth);
        console.log('Viewport width', viewportWidth);
    };
    thumbPosition;

    // Dynamic style generators

    const getTrackStyle = () => {
        if (!scrollConfig.hideArrowBtnsWhenInactive || isActive) {
            // Active state
            return {
                position: 'fixed',
                width: x
                    ? scrollConfig.enableArrowBtns
                        ? `calc(100vw - ${scrollConfig.arrowBtnsLength * 2}px)`
                        : `100vw`
                    : scrollConfig.trackThickness,
                height: y
                    ? scrollConfig.enableArrowBtns
                        ? `calc(100vh - ${scrollConfig.arrowBtnsLength * 2}px)`
                        : `100vh`
                    : scrollConfig.trackThickness
            };
        } else {
            // Inactive state
            return {
                position: 'fixed',
                width: '10px',
                height: '100vh'
            };
        }
    };

    const getThumbStyle = () => {
        return {
            position: 'absolute',
            cursor: 'grab',
            ...(x
                ? {
                      top: '50%',
                      transform: `translate(${thumbPosition}px, -50%)`,
                      width: `${heightProportion}%`,
                      height: '100%'
                  }
                : {
                      left: '50%',
                      transform: `translate(-50%, ${thumbPosition}px)`,
                      width: '100%',
                      height: `${heightProportion}%`
                  })
        };
    };

    const getArrowBtnsStyle = () => ({
        width: x ? `var(--arrow-btns-length)` : '100%',
        height: y ? `var(--arrow-btns-length)` : '100%',
        opacity: isActive ? 1 : 0
    });

    // Render methods

    const renderArrows = (direction) => {
        const directions = {
            vertical: ['up', 'down'],
            horizontal: ['left', 'right']
        };

        return directions[direction].map((dir) => (
            <div key={dir} className="arrow-btns-container">
                <div
                    className={`arrow-btn arrow-btn-${dir}`}
                    style={getArrowBtnsStyle()}
                />
            </div>
        ));
    };

    // Main render logic
    const renderScrollbar = () => {
        if (!x && !y) return null;

        return (
            <div
                ref={trackRef}
                className={`scrollbar-track ${!isActive ? 'inactive' : ''}`}
                style={getTrackStyle()}
            >
                {y && (
                    <>
                        {scrollConfig.enableArrowBtns ? renderArrows('vertical') : null}
                        <div
                            ref={thumbRef}
                            onMouseDown={handleMouseDown}
                            className="thumb"
                            style={getThumbStyle()}
                        />
                    </>
                )}

                {x && (
                    <>
                        {scrollConfig.enableArrowBtns ? renderArrows('horizontal') : null}
                        <div
                            ref={thumbRef}
                            onMouseDown={handleMouseDown}
                            className="thumb"
                            style={getThumbStyle()}
                        />
                    </>
                )}
            </div>
        );
    };

    // Call the log function after each render
    useEffect(() => {
        logSizes();
    });

    return renderScrollbar();
}

export default CustomScrollbar;
