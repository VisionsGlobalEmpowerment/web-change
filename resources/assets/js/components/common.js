import {animated, interpolate, Keyframes} from "react-spring";
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import React from "react";
import {movementSpeed, disabled} from "./animations";
import {play} from "./sounds";

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
    return <g transform={'translate(' + props.x + ',' + props.y + ')'}
              onClick={() => props.locked ? false : props.onClick()}
              className={'location-entrance-' + props.locationKey + (props.locked ? '-locked' : '')}
              fill={"#00bcd4"}>
        <rect x={0} y={0} width={50} height={50} rx={5} />
        <text x={5} y={25} fill={"black"}>{props.name}</text>
    </g>;
};

export const LocationEntrance = pipe(
    withEffect("entrance"),
) (LocationEntranceComponent);

const LessonEntranceComponent = (props) => {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'} onClick={() => props.onClick()}>
        <rect x={0} y={0} width={50} height={50} rx={5} fill={"#00bcd4"}
              className={'location-entrance-' + props.locationKey} />
        <text x={5} y={25} >{props.name} {props.completed && "(c)"}</text>
    </g>;
};

export const LessonEntrance = pipe(
    withEffect("entrance"),
) (LessonEntranceComponent);

export function Character(props) {
    return <circle cx={0} cy={0} r={10} fill={"#383ce5e"} />
}

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
