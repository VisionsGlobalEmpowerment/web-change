import React, {Component} from 'react';
import {exit} from "../../model/menu";
import {Circle, Group, Layer, Path} from "react-konva";

export const Menu = ({viewBox, viewPort}) => {
    const scale = viewBox.width / viewPort.width;
    const x = viewBox.x  * scale + viewBox.width - 68;
    const y = viewBox.y + 20 ;

    return <Group x={x} y={y}
                  onClick={() => exit()}
                  onTap={() => exit()}
    >
        <Circle x={24} y={24} radius={30} fill={'#ffffff'}/>
        <Path data={"M38 12.83L35.17 10 24 21.17 12.83 10 10 12.83 21.17 24 10 35.17 12.83 38 24 26.83 35.17 38 38 35.17 26.83 24z"} fill={"#1b1b1b"}/>
    </Group>;
};

export const Back = ({viewBox, viewPort, onClick}) => {
    const scale = viewBox.width / viewPort.width;
    const x = viewBox.x  * scale + viewBox.width - 136 ;
    const y = viewBox.y + 20;

    return  <Group x={x} y={y}
                   onClick={onClick}
                   onTap={onClick}
    >
        <Circle x={24} y={24} radius={30} fill={'#ffffff'}/>
        <Path data={"M40 22H15.66l11.17-11.17L24 8 8 24l16 16 2.83-2.83L15.66 26H40v-4z"} fill={"#1b1b1b"}/>
    </Group>
};
