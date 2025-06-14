/* eslint-disable no-unused-vars */
import { useRef, useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useQueries, useQuery } from '@tanstack/react-query';
import { normalize, compareTwoStrings } from 'string-similarity';
import SearchButton from '../../buttons/SearchButton';
import SearchInput from './SearchInput';
import Loading from '../Loading';
import ImagePlaceholder from '../../app/ImagePlaceholder';
import useFetchStore from '../../../stores/fetchStore';
import useNavStore from '../../../stores/navStore';

export default function SearchBar() {
    const {
        fetchSearchQueries,
        fetchMovieQueries,
        fetchShowsQueries,
        fetchShowsDetails
    } = useFetchStore();
    const { query, setQuery } = useNavStore();

    const searchBarRef = useRef(null);
    const [isSearchBarOpen, setIsSearchBarOpen] = useState(false);
    const [imgError, setImgError] = useState(false);

    const handleImageError = () => setImgError(true);

    // Query cleanup and typo correction (simple)
    function rewriteQuery(raw) {
        return raw
            .trim()
            .replace(/[^a-zA-Z0-9\s]/g, '') // Remove special chars
            .replace(/\s+/g, ' ') // Normalize spaces
            .toLowerCase();
    }

    const cleanedQuery = rewriteQuery(query);

    // Run query
    const { data, isLoading, error } = useQuery({
        queryKey: ['searchQuery', cleanedQuery],
        queryFn: () => fetchSearchQueries(cleanedQuery),
        enabled: !!cleanedQuery
    });

    const queryLoading = isLoading;
    const queryError = error;

    const scoredResults = (data || []).map((item) => {
        const label = item.title || item.name || '';
        const simScore = compareTwoStrings(cleanedQuery, rewriteQuery(label));
        return {
            ...item,
            _score: simScore,
            _popularity: item.popularity || 0,
            _vote: item.vote_average || 0
        };
    });

    // Sort by fuzzy match score, then rating & popularity
    const sortedQueryData = scoredResults
        .sort((a, b) => {
            if (b._score !== a._score) return b._score - a._score;
            if (b._vote !== a._vote) return b._vote - a._vote;
            return b._popularity - a._popularity;
        })
        .slice(0, 10);

    const handleInputChange = (event) => {
        setQuery(event.target.value);
        setIsSearchBarOpen(true);
    };

    const queryResultState = query
        ? queryLoading
            ? 'loading'
            : sortedQueryData.length > 0
              ? 'active'
              : 'failed'
        : 'inactive';

    // Fetch show details for each media item
    const showsDetailsQueries = sortedQueryData
        .filter((media) => media.name)
        .map((media) => ({
            queryKey: ['showsDetails', media.id],
            queryFn: () => fetchShowsDetails(media.id),
            enabled: Boolean(media.id)
        }));

    const showsDetailsData = useQueries({ queries: showsDetailsQueries });

    const handleClickOutside = useCallback(
        (event) => {
            if (searchBarRef.current && !searchBarRef.current.contains(event.target)) {
                setIsSearchBarOpen(false);
                setQuery('');
            }
        },
        [setQuery]
    );

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [handleClickOutside]);

    return (
        <div className="searchbar-container" ref={searchBarRef}>
            <SearchInput
                className="searchbar-input"
                value={query}
                onChange={handleInputChange}
            />

            <SearchButton className="searchbar-btn" disabled={!query} />

            <div className={`query-results ${queryResultState}`}>
                {sortedQueryData.length > 0
                    ? sortedQueryData.map((media, index) => {
                          const title = media.title || media.name;

                          let mediaType;
                          switch (media.media_type) {
                              case 'person':
                                  mediaType = 'cast';
                                  break;
                              case 'tv':
                                  mediaType = 'shows';
                                  break;
                              case 'movie':
                                  mediaType = 'movie';
                                  break;
                              default:
                                  mediaType = '';
                          }

                          const imageUrl = media?.poster_path
                              ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
                              : `https://image.tmdb.org/t/p/w500${media.profile_path}`;

                          const shows = showsDetailsData[index]?.data;
                          const inProduction =
                              showsDetailsData[index]?.data?.in_production;

                          // {mediaType === 'shows' ? console.log(showsDetailsData[index]?.data) : console.log('not found')}
                          const isTitleOverflowing = title.length > 16;
                          let isMovie = media.title !== undefined ? true : false;

                          const departmentMappings = {
                              Acting: (media) => {
                                  if (media.gender === 2) {
                                      return 'Actor';
                                  } else if (media.gender === 1) {
                                      return 'Actress';
                                  } else {
                                      return 'Actor/Actress'; // Handle cases with no gender
                                  }
                              },
                              Directing: () => 'Director',
                              Writing: () => 'Writer',
                              Production: () => 'Producer',
                              Camera: () => 'Cinematographer',
                              Sound: () => 'Sound Designer',
                              Editing: () => 'Editor',
                              Art: () => 'Art Director',
                              'Costume & Make-Up': () => 'Costume & Make-Up',
                              'Visual Effects': () => 'Visual Effects',
                              Crew: () => 'Crew',
                              Creator: () => 'Creator'
                          };

                          function mapKnownForDepartment(media) {
                              if (!media || !media.known_for_department) {
                                  return 'Crew';
                              }

                              const department = media.known_for_department;
                              const mappingFunction = departmentMappings[department];
                              if (mappingFunction) {
                                  return mappingFunction(media);
                              }
                              return 'Crew'; // Default if not found
                          }

                          let infoText;
                          if (mediaType === 'cast') {
                              infoText = media.known_for_department ? (
                                  <>
                                      <span
                                          className="department"
                                          title={`Known For: ${media.known_for_department}`}
                                      >
                                          {mapKnownForDepartment(media)}
                                      </span>
                                  </>
                              ) : (
                                  'N/A'
                              );
                          } else {
                              infoText = isMovie ? (
                                  media.release_date?.slice(0, 4) || 'N/A'
                              ) : inProduction ? (
                                  <>
                                      <span
                                          className="date"
                                          title={`${shows?.first_air_date} (in production)`}
                                      >
                                          Since{' '}
                                          {shows?.first_air_date?.slice(0, 4) || 'N/A'}
                                      </span>
                                  </>
                              ) : (
                                  <>
                                      <span
                                          className="date"
                                          title={shows?.first_air_date}
                                      >
                                          {shows?.first_air_date?.slice(0, 4) || 'N/A'}
                                      </span>
                                      <span className="date-separator">–</span>
                                      <span className="date" title={shows?.last_air_date}>
                                          {shows?.last_air_date?.slice(0, 4) || 'N/A'}
                                      </span>
                                  </>
                              );
                          }

                          return (
                              <Link
                                  to={`/${mediaType}/${media.id}`}
                                  className="query-results-items"
                                  key={media.id}
                              >
                                  <div className="query-results-item-poster">
                                      {imageUrl && !imgError ? (
                                          <div className="query-results-item-poster">
                                              <img
                                                  src={imageUrl}
                                                  alt={title}
                                                  onError={handleImageError}
                                              />
                                          </div>
                                      ) : (
                                          <ImagePlaceholder
                                              className="query-results-item-poster"
                                              false
                                          />
                                      )}
                                  </div>
                                  <div className="right-section">
                                      <p
                                          className="title"
                                          title={isTitleOverflowing ? title : ''}
                                      >
                                          {title}
                                      </p>
                                      <p
                                          className="info"
                                          //   title={isInfoOverflowing ? infoText : ''}
                                      >
                                          {infoText}
                                      </p>
                                  </div>
                              </Link>
                          );
                      })
                    : null}

                {queryLoading ? (
                    <Loading />
                ) : (
                    <p
                        className="query-results-error-message"
                        title={queryError ? `: ${queryError.message}` : ''}
                    >
                        No results for &quot;{query}&quot;
                    </p>
                )}
            </div>
        </div>
    );
}
