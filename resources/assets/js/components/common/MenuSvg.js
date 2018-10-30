import React, {Component} from 'react';
import {exit} from "../../model/menu";
import {openSettings} from "../../model/settings";
import {getData} from "../../model/cache";

const Close = ({x, y}) => {
    return <g transform={`translate(${x} ${y})`} onClick={() => exit()} >
        <circle cx={50} cy={50} r={50} fill={'url(#close)'}/>

    </g>
};

const Settings = ({x, y}) => {
    return <g transform={`translate(${x} ${y})`} onClick={() => openSettings()} >
        <circle cx={50} cy={50} r={50} fill={'url("#settings")'}/>
    </g>
}

export const Menu = ({viewBox, viewPort}) => {
    const scale = viewBox.width / viewPort.width;
    const x = viewBox.x + viewBox.width;
    const y = viewBox.y + Math.round(20 * scale);

    return <g>
        <defs>
            <pattern id="settings" x="0" y="0" width={100} height={100} patternUnits="userSpaceOnUse">
                <image xlinkHref={getData("/raw/img/ui/settings_button_01.png")} x={0} y={0} width={100} height={100} />
            </pattern>

            <pattern id="settings-highlight" x="0" y="0" width={100} height={100} patternUnits="userSpaceOnUse">
                <image xlinkHref={getData("/raw/img/ui/settings_button_02.png")} x={0} y={0} width={100} height={100} />
            </pattern>

            <pattern id="close" x="0" y="0" width={100} height={100} patternUnits="userSpaceOnUse">
                <image xlinkHref={getData("/raw/img/ui/close_button_01.png")} x={0} y={0} width={100} height={100} />
            </pattern>

            <pattern id="close-highlight" x="0" y="0" width={100} height={100} patternUnits="userSpaceOnUse">
                <image xlinkHref={getData("/raw/img/ui/close_button_02.png")} x={0} y={0} width={100} height={100} />
            </pattern>
        </defs>

        <Settings x={x - Math.round(216 * scale)} y={y}/>
        <Close x={x - Math.round(108 * scale)} y={y}/>
    </g>

};
