/* eslint-disable react/prop-types */
const VoteAverage = ({ voteAverage }) => {
    const ratingColor =
        voteAverage >= 8.5
            ? '#00e676' // Vibrant green
            : voteAverage >= 7
              ? '#c6ff00' // Lime
              : voteAverage >= 5.5
                ? '#ffca28' // Amber
                : voteAverage >= 4
                  ? '#ff7043' // Deep orange
                  : '#ef5350'; // Soft red

    return (
        <div className="carousel-detail-rating">
            <span
                className="rating-span"
                style={{
                    color: ratingColor,
                    fontWeight: 'bold',
                    fontSize: '20px'
                }}
            >
                {voteAverage.toFixed(1)}
            </span>
        </div>
    );
};

export default VoteAverage;
