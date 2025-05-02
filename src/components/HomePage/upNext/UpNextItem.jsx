/* eslint-disable react/prop-types */
import Slide from '../Slide';
import Genre from './Genre';
import { useQuery } from '@tanstack/react-query';
import useFetchStore from '../../../stores/fetchStore';
import { Link } from 'react-router-dom';

const UpNextItem = ({ media, index, translateY }) => {
    const mediaType = media?.name ? 'shows' : 'movie';
    const { fetchMovieCredits } = useFetchStore();

    const {
        data: creditsData,
        isLoading: creditsLoading,
        error: creditsError
    } = useQuery({
        queryKey: ['credits', media?.id],
        queryFn: () => fetchMovieCredits(media?.id)
    });

    const director = creditsData?.crew?.find((member) => member.job === 'Director');
    const directorName = creditsLoading
        ? 'Loading...'
        : director
          ? director.name
          : creditsError
            ? 'Error fetching director'
            : 'Director not found';

    return (
        <div className="up-next-item" style={{ transform: `translateY(${translateY}%)` }}>
            <Link to={`/${mediaType}/${media.id}`} className="poster">
                <Slide slide={media} posterDetail={false} />
            </Link>

            <div className="right-side">
                <div className="heading">
                    <Link to={`/${mediaType}/${media.id}`}>
                        <p className="title">{media?.title || media?.name}</p>
                    </Link>
                    <p className="director-name">Directed by {directorName}</p>
                </div>

                <div className="genres-container">
                    <div className="genre-scroll-container">
                        {media.genre_ids && media.genre_ids.length > 0 ? (
                            <Genre genreIds={media.genre_ids} />
                        ) : (
                            <div>Genre not available</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UpNextItem;
