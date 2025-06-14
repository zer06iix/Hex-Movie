import { memo } from 'react';
import DynamicButton from '../../components/buttons/DynamicButton';
import MetadataDisplay from './MetadataDisplay';
import BioModal from './BioModal';
import PropTypes from 'prop-types';

const CastMemberDetailsInfo = memo(
    ({
        castDetailsData,
        age,
        handleOpenBioModal,
        renderModal,
        isBioModalOpen,
        bioModalRef,
        handleCloseBioModal,
        bioSource,
        setBioSource,
        castDetailsLoading,
        castDetailsError,
        wikipediaBioLoading,
        wikipediaBioError,
        wikipediaBio
    }) => {
        return (
            <div className="cast-member-details-page__info">
                <div className="cast-member-details-page__title">
                    {castDetailsData?.name}
                </div>
                <MetadataDisplay castDetailsData={castDetailsData} age={age} />

                <div className="cast-member-details-page__details-container">
                    <DynamicButton
                        className="cast-member-details-page__details-button"
                        onClick={handleOpenBioModal}
                    >
                        Biography
                    </DynamicButton>

                    <DynamicButton className="cast-member-details-page__details-button">
                        Awards
                    </DynamicButton>

                    <DynamicButton className="cast-member-details-page__details-button">
                        Socials
                    </DynamicButton>
                </div>

                {renderModal && (
                    <BioModal
                        isBioModalOpen={isBioModalOpen}
                        bioModalRef={bioModalRef}
                        handleCloseBioModal={handleCloseBioModal}
                        bioSource={bioSource}
                        setBioSource={setBioSource}
                        castDetailsLoading={castDetailsLoading}
                        castDetailsError={castDetailsError}
                        castDetailsData={castDetailsData}
                        wikipediaBioLoading={wikipediaBioLoading}
                        wikipediaBioError={wikipediaBioError}
                        wikipediaBio={wikipediaBio}
                    />
                )}
            </div>
        );
    }
);

CastMemberDetailsInfo.displayName = 'CastMemberDetailsInfo';

CastMemberDetailsInfo.propTypes = {
    castDetailsData: PropTypes.shape({
        name: PropTypes.string,
        birthday: PropTypes.string,
        deathday: PropTypes.string,
        biography: PropTypes.string
    }),
    age: PropTypes.number,
    handleOpenBioModal: PropTypes.func.isRequired,
    renderModal: PropTypes.bool.isRequired,
    isBioModalOpen: PropTypes.bool.isRequired,
    bioModalRef: PropTypes.shape({
        current: PropTypes.instanceOf(Element)
    }).isRequired,
    handleCloseBioModal: PropTypes.func.isRequired,
    bioSource: PropTypes.oneOf(['tmdb', 'wikipedia']).isRequired,
    setBioSource: PropTypes.func.isRequired,
    castDetailsLoading: PropTypes.bool.isRequired,
    castDetailsError: PropTypes.object,
    wikipediaBioLoading: PropTypes.bool,
    wikipediaBioError: PropTypes.object,
    wikipediaBio: PropTypes.string
};

export default CastMemberDetailsInfo;
