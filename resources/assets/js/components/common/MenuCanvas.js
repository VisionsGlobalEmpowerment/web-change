import React, {Component} from 'react';
import {exit} from "../../model/menu";
import {Circle, Group, Layer, Path} from "react-konva";
import {KImage} from "../common";

export const Menu = ({viewBox, viewPort}) => {
    const scale = viewBox.width / viewPort.width;
    const x = viewBox.x  * scale + viewBox.width - 108;
    const y = viewBox.y + 20 ;

    return <Group x={x} y={y}
                  onClick={() => exit()}
                  onTap={() => exit()}
    >
        <KImage image={"/raw/img/ui/close_button_01.png"}/>
    </Group>;
};

export const Back = ({viewBox, viewPort, onClick}) => {
    const scale = viewBox.width / viewPort.width;
    const x = viewBox.x  * scale + viewBox.width - 216 ;
    const y = viewBox.y + 20;

    return  <Group x={x} y={y}
                   onClick={onClick}
                   onTap={onClick}
    >
        <KImage image={"/raw/img/ui/back_button_01.png"}/>
    </Group>
};
