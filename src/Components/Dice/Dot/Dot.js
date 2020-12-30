import React from 'react';
import './Dot.scss';

const Dot = (props) => {
    return(
        <span className={`dot ${props.dotStyle}`}></span>
    )
}

export default Dot;