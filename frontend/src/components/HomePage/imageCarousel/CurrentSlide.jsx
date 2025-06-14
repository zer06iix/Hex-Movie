/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import { forwardRef } from 'react';
import Slide from '../Slide';

const CurrentSlide = forwardRef(({ slide }, ref) => {
    return <Slide slide={slide} posterDetail={true} eager={true} ref={ref} />;
});

export default CurrentSlide;
