import sprite from '../../styles/sprite.svg';

const ImagePlaceholder = ({ className = '', desc = true, ...props }) => {
    const showDescription = typeof props.false === 'boolean' ? !props.false : desc;
    const combinedClassName = `image-placeholder ${className}`.trim();

    return (
        <div className={combinedClassName}>
            <svg className="image-placeholder-icon">
                <use xlinkHref={`${sprite}#image-placeholder`} />
            </svg>
            {showDescription ? (
                <p className="image-placeholder-text">Failed to load</p>
            ) : null}
        </div>
    );
};

export default ImagePlaceholder;
