import {Component} from "react";
import { animated, Keyframes, config } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import React from "react";

const Wheel = ({ rotation }) => {
    return <g>
        <polygon points="255,255 355,500 155,500" stroke="red" fill="transparent" strokeWidth="5" />
        <animated.g transform={rotation.interpolate(x => `rotate(${x} 255 255)`)}>

            <circle cx={255} cy={255} r={200} stroke="red" fill="transparent" strokeWidth="5"/>
            <g transform={'translate(' + 55 + ' ' + 255 + ')'}>
                <animated.rect transform={rotation.interpolate(x => `rotate(-${x}) translate(-25 0)`)} width={50} height={50} rx={5} fill={"#00bcd4"}/>
            </g>

        </animated.g>
    </g>
}

export default class FerrisWheel extends Component {
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
                {Wheel}
            </Container>
        </svg>
    }
}