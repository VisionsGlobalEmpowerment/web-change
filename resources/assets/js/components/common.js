import {animated, interpolate, Keyframes} from "react-spring";
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import React from "react";
import {movementSpeed, disabled} from "./animations";
import {play} from "./sounds";
import {getData} from "../model/cache";
import {Image} from "react-konva";
import {register, unregister} from "../model/identityMap";

function toSegments(path) {
    let currentX = undefined, currentY = undefined;
    let result = [];

    for (const {x, y} of path) {
        if (currentX !== undefined) {
            result.push({start: {x: currentX, y: currentY}, end: {x: x, y: y}})
        }
        currentX = x;
        currentY = y;
    }

    return result;
}

function withLength(segment) {
    const {start: {x: startX, y: startY}, end: {x: endX, y: endY}} = segment;
    const length = Math.sqrt(Math.pow((endX - startX), 2) + Math.pow((endY - startY), 2));
    return Object.assign(segment, {length: length});
}

function durationFromLength(length) {
    if (length < 10) {
        return 10 * movementSpeed;
    }

    return length * movementSpeed;
}

export const withEffect = (soundId, handler = 'onClick') => (WrappedComponent) => {
    return class extends React.Component {
        withOnEvent(onEvent) {
            play(soundId);
            if (onEvent) {
                onEvent();
            }
        }

        render() {
            const { [handler]: onEvent, ...props } = this.props;

            props[handler] = () => this.withOnEvent(onEvent);
            return <WrappedComponent {...props} />;
        }
    };
};

export const pipe = (...fns) => x => fns.reduce((v, f) => f(v), x);

const LocationEntranceComponent = (props) => {
    return <g transform={'translate(' + props.location.x + ',' + props.location.y + ')'}
              onClick={() => props.locked ? false : props.onClick()}
              className={'location-entrance-' + props.location.key + (props.locked ? '-locked' : '')}>
        <rect x={0} y={0} width={props.location.width} height={props.location.height} fillOpacity={1}/>
    </g>;
};

export const LocationEntrance = pipe(
    withEffect("entrance"),
) (LocationEntranceComponent);


export function withMovement(WrappedComponent) {
    return class extends React.Component {
        keyframesFor(path) {
            const configured = toSegments(path)
                .map(s => withLength(s))
                .map(s => Object.assign(s, {config: {duration: durationFromLength(s.length), easing: Easing.linear}}));

            const [{start: from, end: to, config}, ...segments] = configured;

            return [{from: from, to: to, config: config}]
                .concat(segments.map(segment => ({to: segment.end, config: segment.config})));
        }

        isDestination(args, path) {
            const destination = path[path.length - 1];

            return args.x === destination.x && args.y === destination.y;
        }

        render() {
            const { path, onMovementFinish, ...props } = this.props;
            const Container = Keyframes.Spring(this.keyframesFor(path));

            return <Container native impl={TimingAnimation} config={{easing: Easing.linear}}
                              immediate={disabled}
                           onRest={(args) => {this.isDestination(args, path) ? onMovementFinish() : false}}>
                {({ x, y }) => (
                    <animated.g transform={interpolate([x, y], (x, y) => `translate(${x}, ${y})`)}>
                        <WrappedComponent {...props} />
                    </animated.g>
                )}
            </Container>;
        }
    };
}

export const withRegistration = (key) => (WrappedComponent) => {
    return class extends React.Component {
        componentWillUnmount() {
            unregister(key);
        }

        render() {
            return <WrappedComponent ref={e => register(key, e)} {...this.props} />;
        }
    };
};

export class Vera extends React.Component {
    state = {
        state: 'default',
    };

    toState (state) {
        this.setState({state: state})
    }

    async toAnimation (state) {
        return Promise.resolve();
    }

    render() {
        const {
            x,
            y,
            scale = 1,
        } = this.props;

        const transform = this.state.state === 'default' || true ?
            'translate(' + x + ',' + y + ')' + ' scale(' + scale * 0.8 + ')':
            'translate(' + x + ',' + y + ')' + ' scale(' + scale * 0.8 + ')' + ' scale(-1, 1) translate(-431, 0)';

        return (
            <g>
                <pattern id="vera" width={596} height={842} patternUnits="userSpaceOnUse">
                    <image className={'test-animation'} xlinkHref={getData("/raw/img/vera/10_sprite_test.png")} width={16092} height={842}/>
                </pattern>
                <g transform={transform}
                   className={'vera'}>
                    <rect x={0} y={0} width={596} height={842}/>
                </g>
            </g>
        );
    };
}

export class KImage extends React.Component {
    state = {
        path: null,
        image: null,
    };

    componentDidMount() {
        this.updateImage();
    }

    updateImage() {
        const image = new window.Image();
        image.src = getData(this.props.image);
        image.onload = () => {
            this.setState({
                image: image,
                path: this.props.image,
            });
        };
    }

    imageChanged() {
        return this.props.image !== this.state.path;
    }

    render() {
        if (this.imageChanged()) {
            this.updateImage();
        }
        return <Image image={this.state.image} />;
    }
}
