import {Component} from "react";
import { animated, Keyframes, config } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import React from "react";

const radius = 200;

function getCoordinates(index, length) {
    let angle = (360 / length) * index;
    if (angle > 270) {
        angle -= 270;
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * radius;
        const b = Math.sqrt(Math.pow(radius, 2) - Math.pow(a, 2));
        return {x: 255+a, y: 255+b};
    } else if (angle > 180) {
        angle -= 180;
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * radius;
        const b = Math.sqrt(Math.pow(radius, 2) - Math.pow(a, 2));
        return {x: 255-b, y: 255+a};
    } else if (angle > 90) {
        angle -= 90;
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * radius;
        const b = Math.sqrt(Math.pow(radius, 2) - Math.pow(a, 2));
        return {x: 255-a, y: 255-b};
    } else {
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * radius;
        const b = Math.sqrt(Math.pow(radius, 2) - Math.pow(a, 2));
        return {x: 255+b, y: 255-a};
    }
}

const Element = ({x, y, rotation, data}) => {
    return <g transform={'translate(' + x + ' ' + y + ')'}>
        <animated.rect transform={rotation.interpolate(r => `rotate(-${r}) translate(-25 0)`)} width={50} height={50} rx={5} fill={data.color}/>
    </g>
}

const Wheel = (items) => ({ rotation }) => {
    return <g>
        <polygon points="255,255 355,500 155,500" stroke="red" fill="transparent" strokeWidth="5" />
        <animated.g transform={rotation.interpolate(x => `rotate(${x} 255 255)`)}>

            <circle cx={255} cy={255} r={radius} stroke="red" fill="transparent" strokeWidth="5"/>
            {items.map((item, index) => {
                const coordinates = getCoordinates(index, items.length);
                return <Element x={coordinates.x} y={coordinates.y} rotation={rotation} data={item} key={item.key}/>
            })}

        </animated.g>
    </g>
}

export default class FerrisWheel extends Component {
    items = [{
        key: 'tornado',
        name: 'Tornado',
        color: '#00bcd4',
    }, {
        key: 'cocodrilo',
        name: 'Cocodrilo',
        color: '#109cf4',
    }, {
        key: 'corona',
        name: 'Corona',
        color: '#703cf4',
    }];

    render() {
        const Container = Keyframes.Spring(async next => {
            while (true) {
                await next({
                    reset: true,
                    from: { rotation: 0 },
                    to: { rotation: 360 },
                })
            }
        })

        return <svg viewBox="0 0 512 512" width={600} height={600}>
            <Container native impl={TimingAnimation} config={{ duration: 10000, easing: Easing.linear }}>
                {Wheel(this.items)}
            </Container>
        </svg>
    }
}