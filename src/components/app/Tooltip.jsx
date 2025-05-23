import PropTypes from 'prop-types';
import { useState, useRef, useLayoutEffect, useEffect } from 'react';
import ReactDOM from 'react-dom';
import '../../styles/tooltip.css';

export default function Tooltip({
    children,
    content,
    placement = 'bottom',
    offset = 1,
    delay = 200
}) {
    const [visible, setVisible] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0 });
    const [side, setSide] = useState(placement);
    const triggerRef = useRef(null);
    const tooltipRef = useRef(null);
    const timerRef = useRef(null);

    const onEnter = () => {
        timerRef.current = setTimeout(() => {
            setMounted(true);
        }, delay);
    };

    const onLeave = () => {
        clearTimeout(timerRef.current);
        setVisible(false);
    };

    useLayoutEffect(() => {
        if (!mounted) return;

        const trig = triggerRef.current.getBoundingClientRect();
        const vw = window.innerWidth;
        const vh = window.innerHeight;

        setVisible(true);

        requestAnimationFrame(() => {
            const tip = tooltipRef.current.getBoundingClientRect();

            let final = placement;
            if (placement === 'auto' || placement === 'bottom' || placement === 'top') {
                const topAvailable = trig.top >= tip.height + offset;
                const bottomAvailable = vh - trig.bottom >= tip.height + offset;

                if (placement === 'auto') {
                    final = bottomAvailable ? 'bottom' : topAvailable ? 'top' : 'bottom';
                } else if (placement === 'bottom' && !bottomAvailable) {
                    final = topAvailable ? 'top' : 'bottom';
                } else if (placement === 'top' && !topAvailable) {
                    final = bottomAvailable ? 'bottom' : 'top';
                }
            }

            const baseOffset = offset;
            const adjustedOffset = final === 'top' ? baseOffset + 10 : baseOffset;

            const top =
                final === 'top'
                    ? trig.top + window.scrollY - tip.height - adjustedOffset
                    : trig.bottom + window.scrollY + adjustedOffset;

            let left = trig.left + window.scrollX + trig.width / 2;
            const half = tip.width / 2;
            if (left - half < offset) left = offset + half;
            if (left + half > vw - offset) left = vw - offset - half;

            setCoords({ top, left });
            setSide(final);
        });
    }, [mounted, placement, offset]);

    useEffect(() => {
        if (!mounted || visible) return;
        const timeout = setTimeout(() => setMounted(false), 150);
        return () => clearTimeout(timeout);
    }, [visible, mounted]);

    useEffect(() => () => clearTimeout(timerRef.current), []);

    return (
        <>
            <span
                ref={triggerRef}
                onMouseEnter={onEnter}
                onMouseLeave={onLeave}
                className="tooltip-trigger"
            >
                {children}
            </span>

            {mounted &&
                ReactDOM.createPortal(
                    <div
                        ref={tooltipRef}
                        className={`tooltip-box tooltip-${side} ${visible ? 'tooltip-enter' : 'tooltip-exit'}`}
                        style={{
                            top: `${coords.top}px`,
                            left: `${coords.left}px`,
                            position: 'absolute'
                        }}
                    >
                        {content}
                    </div>,
                    document.body
                )}
        </>
    );
}

Tooltip.propTypes = {
    children: PropTypes.node.isRequired,
    content: PropTypes.node.isRequired,
    placement: PropTypes.oneOf(['top', 'bottom', 'auto']),
    offset: PropTypes.number,
    delay: PropTypes.number
};
