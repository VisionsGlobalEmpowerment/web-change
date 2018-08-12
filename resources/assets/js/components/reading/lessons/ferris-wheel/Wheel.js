import {Component, PureComponent} from "react";
import React from "react";

import { animated, Keyframes, config } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import * as PropTypes from "prop-types";

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

class Element extends Component {
    state = {
        guessed: false
    };

    guess() {
        this.setState({guessed: true});
    }

    render() {
        const {x, y, rotation, data, onClick} = this.props;
        return <g transform={'translate(' + x + ' ' + y + ')'} className={'word-' + data.key}
                  onClick={() => onClick(data.key, this.guess.bind(this))}>
            <animated.g transform={rotation.interpolate(r => `rotate(-${r}) translate(-25 0)`)}>
                <rect width={50} height={50} rx={5} fill={this.state.guessed ? '#606060' : data.color}/>
                <text x={0} y={-5}>{data.name}</text>
            </animated.g>

        </g>
    }
}

export default class Wheel extends Component {
    shouldComponentUpdate(nextProps, nextState) {
        return false;
    }

    render() {
        const { items, onClick } = this.props;

        const Wheel = ({ rotation }) => {
            return <g>
                <polygon points="255,255 355,500 155,500" stroke="red" fill="transparent" strokeWidth="5" />
                <animated.g transform={rotation.interpolate(x => `rotate(${x} 255 255)`)}>

                    <circle cx={255} cy={255} r={radius} stroke="red" fill="transparent" strokeWidth="5"/>
                    {items.map((item, index) => {
                        const coordinates = getCoordinates(index, items.length);
                        return <Element x={coordinates.x} y={coordinates.y} rotation={rotation}
                                        data={item} key={item.key} onClick={onClick}/>
                    })}

                </animated.g>
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

        return <Container native impl={TimingAnimation} config={{ duration: 10000, easing: Easing.linear }}>
            {Wheel}
        </Container>
    }
}
