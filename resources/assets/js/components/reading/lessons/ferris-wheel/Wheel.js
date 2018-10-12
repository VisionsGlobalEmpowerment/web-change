import {Component} from "react";
import React from "react";

import { animated, Keyframes, config } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'

const radius = 386;
const shift = 140;

function getCoordinates(index, length) {
    const r = radius - shift;
    let angle = (360 / length) * index + (360 / length) / 2;
    if (angle > 270) {
        angle -= 270;
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * r;
        const b = Math.sqrt(Math.pow(r, 2) - Math.pow(a, 2));
        return {x: radius+a, y: radius+b};
    } else if (angle > 180) {
        angle -= 180;
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * r;
        const b = Math.sqrt(Math.pow(r, 2) - Math.pow(a, 2));
        return {x: radius-b, y: radius+a};
    } else if (angle > 90) {
        angle -= 90;
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * r;
        const b = Math.sqrt(Math.pow(r, 2) - Math.pow(a, 2));
        return {x: radius-a, y: radius-b};
    } else {
        const angleRad = angle * Math.PI / 180;
        const a = Math.sin(angleRad) * r;
        const b = Math.sqrt(Math.pow(r, 2) - Math.pow(a, 2));
        return {x: radius+b, y: radius-a};
    }
}

class Element extends Component {
    state = {
        guessed: false,
        failed: false
    };

    getVisualState(data, markedAsGuessed, markedAsFailed) {
        if (markedAsFailed) {
            return 'url(#alert_' + data.key + ')';
        } else if (markedAsGuessed) {
            return 'url(#done_' + data.key + ')';
        } else {
            return 'url(#default_' + data.key + ')';
        }
    }

    componentDidMount() {
        this.props.ferrisWheel.register('onFail', (key) => {
            if (this.props.data.key === key) {
                this.forceUpdate();
            }
        });

        this.props.ferrisWheel.register('onSuccess', (key) => {
            if (this.props.data.key === key) {
                this.forceUpdate();
            }
        })
    }

    render() {
        const {x, y, rotation, data, ferrisWheel} = this.props;
        const key = data.key;
        const markedAsGuessed = ferrisWheel.isGuessed(data.key);
        const markedAsFailed = ferrisWheel.isFailed(data.key);

        const visualState = this.getVisualState(data, markedAsGuessed, markedAsFailed);

        return <g>
            <defs>
                <pattern id={"default_" + key} x="0" y="0" width={205} height={209} patternUnits="userSpaceOnUse">
                    <image xlinkHref={"/raw/img/ferris-wheel/words/" + key + "_default.png"} x={0} y={0} width={205} height={209} />
                </pattern>

                <pattern id={"alert_" + key} x="0" y="0" width={205} height={209} patternUnits="userSpaceOnUse">
                    <image xlinkHref={"/raw/img/ferris-wheel/words/" + key + "_alert.png"} x={0} y={0} width={205} height={209} />
                </pattern>

                <pattern id={"done_" + key} x="0" y="0" width={205} height={209} patternUnits="userSpaceOnUse">
                    <image xlinkHref={"/raw/img/ferris-wheel/words/" + key + "_done.png"} x={0} y={0} width={205} height={209} />
                </pattern>

                <pattern id={"active_" + key} x="0" y="0" width={253} height={254} patternUnits="userSpaceOnUse">
                    <image xlinkHref={"/raw/img/ferris-wheel/words/" + key + "_active.png"} x={0} y={0} width={253} height={254} />
                </pattern>
            </defs>

            <g transform={'translate(' + x + ' ' + y + ')'} className={'word-' + data.key}
                      onClick={() => ferrisWheel.pick(data.key)}>
                <animated.g transform={rotation.interpolate(r => `rotate(-${r}) translate(-100 -105)`)}>
                    <rect width={205} height={209} fill={visualState}/>
                </animated.g>

            </g>
        </g>
    }
}

export default class Wheel extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        const { ferrisWheel } = this.props;

        const items = ferrisWheel.getItems();

        const Wheel = ({ rotation }) => {
            return <g transform={'translate(500, 100)'}>
                <animated.g transform={rotation.interpolate(x => `rotate(${x} ${radius} ${radius})`)}>
                    <circle cx={radius} cy={radius} r={radius} fill={'url(#wheel)'}/>
                </animated.g>
                <g transform={'translate(210, 390)'}>
                    <rect x={0} y={0} width={359} height={527} fill={'url(#stand)'}/>
                </g>
                <g>
                    <animated.g transform={rotation.interpolate(x => `rotate(${x} ${radius} ${radius})`)}>
                        <circle cx={radius} cy={radius} r={130} fill={'url(#center)'}/>
                    </animated.g>
                </g>
                <g >
                    <animated.g transform={rotation.interpolate(x => `rotate(${x} ${radius} ${radius})`)}>

                        {items.map((item, index) => {
                            const coordinates = getCoordinates(index, items.length);
                            return <Element x={coordinates.x} y={coordinates.y} rotation={rotation}
                                            data={item} key={item.key} ferrisWheel={ferrisWheel} />
                        })}

                    </animated.g>
                </g>

            </g>
        }

        const Container = Keyframes.Spring(async next => {
            while (true) {
                await next({
                    reset: true,
                    from: { rotation: 0 },
                    to: { rotation: 360 },
                })
            }
        })

        return <Container native impl={TimingAnimation} config={{ duration: 30000, easing: Easing.linear }}>
            {Wheel}
        </Container>
    }
}
