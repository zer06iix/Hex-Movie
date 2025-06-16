/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Loading from '../components/app/Loading';
import useFetchStore from '../stores/fetchStore';
import useShowStore from '../stores/showStore';
import ContentTemplate from './ContentTemplate';

export default function ShowsPage() {
    const { id: showsId } = useParams();
    const { fetchShowsDetails, fetchShowsCredits, fetchGenres } = useFetchStore(); // Make sure fetchGenres is available
    const { shows, setShows, showsCredits, setCredits, genresMap } = useShowStore();
    const [isLoading, setIsLoading] = useState(true);

    const {
        data: showsData,
        isLoading: showsLoading,
        error: showsError
    } = useQuery({
        queryKey: ['showsDetails', showsId],
        queryFn: () => fetchShowsDetails(showsId),
        enabled: !!showsId
    });

    const {
        data: showsCreditsData,
        isLoading: creditsLoading,
        error: creditsError
    } = useQuery({
        queryKey: ['showsCredits', showsId],
        queryFn: () => fetchShowsCredits(showsId),
        enabled: !!showsId
    });

    useEffect(() => {
        fetchGenres(); // Fetch genres
    }, [fetchGenres]);

    useEffect(() => {
        if (showsData) {
            setShows(showsData);
        }
        if (showsCreditsData) {
            setCredits(showsCreditsData);
        }
    }, [showsData, showsCreditsData, setShows, setCredits]);

    useEffect(() => {
        if (genresMap && shows) {
            setIsLoading(false);
        }
    }, [genresMap, shows]);

    if (!shows || isLoading || showsLoading || creditsLoading) return <Loading />; // Handle loading
    if (showsError) return <p>Error loading shows details: {showsError.message}</p>;
    if (creditsError) return <p>Error loading shows credits: {creditsError.message}</p>;
    if (!genresMap) {
        return <Loading />;
    }

    return (
        <ContentTemplate
            type="Shows"
            media={shows}
            creditsData={showsCredits}
            genresMap={genresMap}
        />
    );
}
