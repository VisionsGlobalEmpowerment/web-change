import {Component} from "react";
import React from "react";

import { animated, Keyframes } from 'react-spring/dist/konva.cjs'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import {disabled} from "../../../animations";
import {Group} from 'react-konva';
import {KImage} from "../../../common";

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
            return "/raw/img/ferris-wheel/words/" + data.key + "_alert.png";
        } else if (markedAsGuessed) {
            return "/raw/img/ferris-wheel/words/" + data.key + "_done.png";
        } else {
            return "/raw/img/ferris-wheel/words/" + data.key + "_default.png";
        }
    }

    componentDidMount() {
        this.props.ferrisWheel.register('onFail', (key) => {
            if (this.props.data.key === key) {
                this.setState({failed: true})
            }
        });

        this.props.ferrisWheel.register('onSuccess', (key) => {
            if (this.props.data.key === key) {
                this.setState({guessed: true})
            }
        })
    }

    render() {
        const {x, y, rotation, data, ferrisWheel} = this.props;
        const markedAsGuessed = ferrisWheel.isGuessed(data.key);
        const markedAsFailed = ferrisWheel.isFailed(data.key);

        const visualState = this.getVisualState(data, markedAsGuessed, markedAsFailed);

        return <Group x={x} y={y}
                   onClick={() => ferrisWheel.pick(data.key)}
                   onTap={() => ferrisWheel.pick(data.key)}
            >
                <animated.Group rotation={rotation.interpolate(r => -r)} offset={{x:102, y:104}}>
                    <KImage image={visualState}/>
                </animated.Group>

        </Group>
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
            return <Group x={500} y={100}>
                <animated.Group rotation={rotation} x={radius} y={radius} offset={{x: radius, y: radius}}>
                    <KImage image={"/raw/img/ferris-wheel/ferris_wheel_01.png"}/>
                </animated.Group>
                <Group x={210} y={390}>
                    <KImage image={"/raw/img/ferris-wheel/ferris_wheel_02.png"}/>
                </Group>
                <animated.Group rotation={rotation} x={radius} y={radius} offset={{x: 130, y: 130}}>
                    <KImage image={"/raw/img/ferris-wheel/ferris_wheel_03.png"}/>
                </animated.Group>

                <animated.Group rotation={rotation} x={radius} y={radius} offset={{x: radius, y: radius}}>
                    {items.map((item, index) => {
                        const coordinates = getCoordinates(index, items.length);
                        return <Element x={coordinates.x} y={coordinates.y} rotation={rotation}
                                        data={item} key={item.key} ferrisWheel={ferrisWheel} />
                    })}

                </animated.Group>

            </Group>
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

        return <Container native immediate={disabled} impl={TimingAnimation} config={{ duration: 30000, easing: Easing.linear }}>
            {Wheel}
        </Container>
    }
}
