/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import CastImage from './CastImage';

export default function CastItem({ member }) {
    const nameRef = useRef(null);
    const characterRef = useRef(null);
    const [nameTitle, setNameTitle] = useState('');
    const [characterTitle, setCharacterTitle] = useState('');
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => setImgError(true);

    // Show full title if text is truncated
    useEffect(() => {
        if (nameRef.current) {
            const overflow = nameRef.current.scrollWidth > nameRef.current.clientWidth;
            if (overflow) setNameTitle(member.name);
        }

        if (characterRef.current) {
            const overflow =
                characterRef.current.scrollWidth > characterRef.current.clientWidth;
            if (overflow) setCharacterTitle(member.character || 'Unknown Character');
        }
    }, [member]);

    return (
        <Link to={`/cast/${member.id}`} className="cast-member">
            <div className="cast-image-container">
                {!imgError && <CastImage member={member} onError={handleImageError} />}
            </div>
            <div className="detail">
                <p className="cast-name" ref={nameRef} title={nameTitle}>
                    {member.name}
                </p>
                <p
                    className="cast-character-name"
                    ref={characterRef}
                    title={characterTitle}
                >
                    {member.character || 'Unknown Character'}
                </p>
            </div>
        </Link>
    );
}
