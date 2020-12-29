import React from 'react';
import './Dot.scss';

const Dot = (props) => {
    return(
        <span className={`dot ${props.style}`}></span>
    )
}

export default Dot;