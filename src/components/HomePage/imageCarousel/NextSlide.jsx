/* eslint-disable react/prop-types */
import Slide from '../Slide';

const NextSlide = ({ slide }) => {
    return <Slide slide={slide} posterDetail={true} eager={true} />;
};

export default NextSlide;
