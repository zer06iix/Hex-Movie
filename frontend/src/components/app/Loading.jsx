/* eslint-disable react/prop-types */
const Loading = ({ height = '2.5rem', width = '2.5rem' }) => {
    return (
        <div className="loader-container">
            <div className="animate-spin" style={{ height, width }}></div>
        </div>
    );
};

export default Loading;
