/* eslint-disable no-unused-vars */
import PropTypes from 'prop-types';
import ExpanderButton from '../buttons/ExpanderButton';
import React, { useState, useRef, useEffect, forwardRef } from 'react';

const MediaExpandable = forwardRef(({ content, titleText, expanderText }, ref) => {
    const [showExpanderBtn, setShowExpanderBtn] = useState(false);
    const [showOverview, setShowOverview] = useState(true);
    const [isExpanded, setIsExpanded] = useState(false);
    const [lastVisibleWidth, setLastVisibleWidth] = useState(null);
    const overviewSection = useRef(null);
    const expanderBtnRef = useRef(null);
    const infoRef = useRef(null);
    const shadowOverlayRef = useRef(null);
    const collapsedHeight = 116; // 72px (min text lines) + 44px (heading)
    const [overviewHeight, setOverviewHeight] = useState(collapsedHeight); // Initial collapsed height

    useEffect(() => {
        const handleResize = () => {
            const currentViewportWidth = window.innerWidth;

            if (infoRef.current) {
                const height = infoRef.current.clientHeight;

                if (height > 122) {
                    setShowExpanderBtn(false);
                    setShowOverview(false);
                    if (!lastVisibleWidth) {
                        setLastVisibleWidth(currentViewportWidth);
                    }
                    if (overviewSection.current) {
                        overviewSection.current.style.display = 'none';
                    }
                } else if (height <= 72) {
                    setShowExpanderBtn(false);
                    setShowOverview(true);
                    setOverviewHeight(collapsedHeight);
                    if (overviewSection.current) {
                        overviewSection.current.style.display = 'block';
                        if (shadowOverlayRef.current) {
                            shadowOverlayRef.current.style.opacity = '0';
                        }
                        if (expanderBtnRef.current) {
                            expanderBtnRef.current.style.opacity = '0';
                        }
                    }
                } else {
                    setShowExpanderBtn(true);
                    setShowOverview(true);
                    setOverviewHeight(isExpanded ? height + 44 : collapsedHeight);
                    if (overviewSection.current) {
                        overviewSection.current.style.display = 'block';
                        if (shadowOverlayRef.current) {
                            shadowOverlayRef.current.style.opacity = isExpanded
                                ? '0'
                                : '1';
                        }
                        if (expanderBtnRef.current) {
                            expanderBtnRef.current.style.opacity = '1';
                        }
                    }
                }
            }

            if (lastVisibleWidth && currentViewportWidth <= lastVisibleWidth) {
                setShowOverview(false);
                if (overviewSection.current) {
                    overviewSection.current.style.display = 'none';
                }
            } else if (lastVisibleWidth && currentViewportWidth > lastVisibleWidth) {
                setShowOverview(true);
                setShowExpanderBtn(true);
                if (overviewSection.current) {
                    overviewSection.current.style.display = 'block';
                }
                setLastVisibleWidth(null);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isExpanded, lastVisibleWidth, content, collapsedHeight]);

    useEffect(() => {
        if (infoRef.current) {
            setOverviewHeight(
                isExpanded ? infoRef.current.clientHeight + 44 : collapsedHeight
            );
        }
    }, [isExpanded, collapsedHeight]);

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
        if (infoRef.current) {
            setOverviewHeight(
                !isExpanded ? infoRef.current.clientHeight + 44 : collapsedHeight
            );
        }
        if (shadowOverlayRef.current) {
            shadowOverlayRef.current.style.opacity = isExpanded ? '1' : '0';
        }
    };

    return (
        <div
            ref={overviewSection}
            style={{
                display: showOverview ? 'block' : 'none',
                height: overviewHeight,
                overflow: 'hidden',
                transition: 'height 0.3s ease-in-out'
            }}
            className="overview"
        >
            <div className="heading">
                <p className="title">{titleText}</p>
                {showExpanderBtn && (
                    <ExpanderButton
                        ref={expanderBtnRef}
                        className={`expander ${isExpanded ? 'expanded' : 'collapsed'}`}
                        onClick={toggleExpand}
                        isExpanded={isExpanded}
                        expanderText={expanderText}
                    />
                )}
            </div>

            <p ref={infoRef} className="info">
                {content}
            </p>
            <div ref={shadowOverlayRef} className="shadow-overlay"></div>
        </div>
    );
});

MediaExpandable.propTypes = {
    content: PropTypes.string.isRequired,
    titleText: PropTypes.string.isRequired,
    expanderText: PropTypes.arrayOf(PropTypes.string).isRequired
};

MediaExpandable.displayName = 'MediaOverview';

export default MediaExpandable;
