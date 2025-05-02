/* eslint-disable react/prop-types */
import Slide from '../Slide';

const PreviousSlide = ({ slide }) => {
    return <Slide slide={slide} posterDetail={true} eager={true} />;
};

export default PreviousSlide;
