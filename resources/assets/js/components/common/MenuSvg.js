import React, {Component} from 'react';
import {exit} from "../../model/menu";

export const Menu = ({viewBox, viewPort}) => {
    const scale = viewBox.width / viewPort.width;
    const x = viewBox.x + viewBox.width - Math.round(68 * scale);
    const y = viewBox.y + Math.round(20 * scale);

    return <g transform={`translate(${x} ${y})`} onClick={() => exit()} >
        <circle cx={24} cy={24} r={30} fill={'#ffffff'}/>
        <path d="M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"/>
    </g>

};
