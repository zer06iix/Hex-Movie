import { useState, useRef, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import CustomDropdown from './CustomDropdown';

const BioModal = ({
    isBioModalOpen,
    bioModalRef,
    handleCloseBioModal,
    bioSource,
    setBioSource,
    castDetailsData,
    castDetailsLoading,
    castDetailsError
}) => {
    const [containerHeight, setContainerHeight] = useState(0);
    const containerRef = useRef(null);
    const tmdbBioRef = useRef(null);
    const wikipediaBioRef = useRef(null);
    const modalContentRef = useRef(null); // Added modalContentRef
    const [wikipediaBio, setWikipediaBio] = useState(null);
    const [wikipediaBioLoading, setWikipediaBioLoading] = useState(false);
    const [wikipediaBioError, setWikipediaBioError] = useState(null);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

    const fetchWikipediaBio = useCallback(async (actorName) => {
        if (!actorName) return;
        setWikipediaBioLoading(true);
        setWikipediaBioError(null);
        setWikipediaBio(null);

        const searchTerm = actorName.replace(/ /g, '_');
        const baseURL = 'https://en.wikipedia.org/w/api.php';

        const params = new URLSearchParams({
            action: 'query',
            format: 'json',
            origin: '*',
            prop: 'extracts',
            titles: searchTerm,
            exintro: true,
            explaintext: true
        });

        const apiUrl = `${baseURL}?${params.toString()}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const pages = data.query?.pages;
            if (!pages) {
                throw new Error('No pages found in Wikipedia response');
            }

            const pageId = Object.keys(pages)[0];
            if (pageId === '-1') {
                throw new Error('Wikipedia page not found');
            }

            const extract = pages[pageId]?.extract;
            if (extract) {
                setWikipediaBio(extract);
            } else {
                setWikipediaBioError(new Error('No extract found in Wikipedia response'));
            }
        } catch (error) {
            console.error('Error fetching Wikipedia biography:', error);
            setWikipediaBioError(error);
        } finally {
            setWikipediaBioLoading(false);
        }
    }, []);

    // Fetch all bios initially when castDetailsData?.name is available
    useEffect(() => {
        if (castDetailsData?.name && !initialLoadComplete) {
            fetchWikipediaBio(castDetailsData.name);
            setInitialLoadComplete(true);
        }
    }, [castDetailsData?.name, fetchWikipediaBio, initialLoadComplete]);

    useEffect(() => {
        if (castDetailsData?.name && initialLoadComplete) {
            setWikipediaBio(null);
            setWikipediaBioError(null);
            setWikipediaBioLoading(false);
            fetchWikipediaBio(castDetailsData.name);
        } else if (!castDetailsData?.name) {
            setInitialLoadComplete(false);
        }
    }, [castDetailsData?.name, fetchWikipediaBio, initialLoadComplete]);

    const updateContainerHeight = useCallback(() => {
        if (!containerRef.current) return;

        let activeRef = null;
        if (bioSource === 'tmdb') {
            activeRef = tmdbBioRef.current;
        } else if (bioSource === 'wikipedia') {
            activeRef = wikipediaBioRef.current;
        }

        if (activeRef) {
            setContainerHeight(activeRef.offsetHeight);
        } else {
            setContainerHeight(0);
        }
    }, [bioSource]); // Removed tmdbBioRef, wikipediaBioRef from dependency array as refs are stable

    useEffect(() => {
        updateContainerHeight();
    }, [
        updateContainerHeight,
        bioSource,
        castDetailsLoading,
        castDetailsData?.biography,
        wikipediaBioLoading,
        wikipediaBio
    ]);

    useEffect(() => {
        updateContainerHeight();
        window.addEventListener('resize', updateContainerHeight);

        return () => {
            window.removeEventListener('resize', updateContainerHeight);
        };
    }, [updateContainerHeight]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                modalContentRef.current && // Use modalContentRef here
                !modalContentRef.current.contains(event.target) // Use modalContentRef here
            ) {
                handleCloseBioModal();
            }
        };

        if (isBioModalOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isBioModalOpen, handleCloseBioModal]); // Removed modalContentRef from dependency array as ref is stable

    return (
        <div
            className={`cast-member-details-page__bio-modal ${
                isBioModalOpen ? 'open' : ''
            }`}
            ref={bioModalRef}
        >
            <div
                className="cast-member-details-page__bio-modal-content"
                ref={modalContentRef}
            >
                {' '}
                {/* Added modalContentRef here */}
                <div className="cast-member-details-page__bio-modal-header">
                    <div className="cast-member-details-page__bio-modal-header--left-container">
                        <p className="cast-member-details-page__bio-modal-title">
                            Biography
                        </p>
                        <CustomDropdown
                            bioSource={bioSource}
                            setBioSource={setBioSource}
                        />
                    </div>
                </div>
                <div
                    className="cast-member-details-page__biography-text-container"
                    ref={containerRef}
                    style={{ height: `${containerHeight}px` }}
                >
                    <div className="biography-shadow-overlay biography-shadow-overlay-start"></div>

                    {bioSource === 'tmdb' && (
                        <>
                            {castDetailsLoading ? (
                                <div>Loading biography from TMDB...</div>
                            ) : castDetailsError || !castDetailsData?.biography ? (
                                <div>Could not load biography from TMDB.</div>
                            ) : (
                                <p
                                    className="cast-member-details-page__biography-text"
                                    ref={tmdbBioRef}
                                >
                                    {castDetailsData.biography}
                                </p>
                            )}
                        </>
                    )}

                    {bioSource === 'wikipedia' && (
                        <>
                            {wikipediaBioLoading ? (
                                <div>Loading from Wikipedia...</div>
                            ) : wikipediaBioError ? (
                                <div>Error loading from Wikipedia.</div>
                            ) : !wikipediaBio ? (
                                <div>Could not load biography from Wikipedia.</div>
                            ) : (
                                <p
                                    className="cast-member-details-page__biography-text"
                                    ref={wikipediaBioRef}
                                >
                                    {wikipediaBio}
                                </p>
                            )}
                        </>
                    )}

                    <div className="biography-shadow-overlay biography-shadow-overlay-end"></div>
                </div>
            </div>
        </div>
    );
};

BioModal.propTypes = {
    isBioModalOpen: PropTypes.bool.isRequired,
    bioModalRef: PropTypes.oneOfType([
        PropTypes.func,
        PropTypes.shape({ current: PropTypes.instanceOf(Element) })
    ]).isRequired,
    handleCloseBioModal: PropTypes.func.isRequired,
    bioSource: PropTypes.string.isRequired,
    setBioSource: PropTypes.func.isRequired,
    castDetailsData: PropTypes.shape({
        biography: PropTypes.string,
        name: PropTypes.string
    }),
    castDetailsLoading: PropTypes.bool.isRequired,
    castDetailsError: PropTypes.instanceOf(Error)
};

BioModal.displayName = 'BioModal';

export default BioModal;
