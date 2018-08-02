import {animated, Spring} from "react-spring";
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import React from "react";

function getDuration(to, from) {
    const duration = Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2)) * 10;
    if (duration < 100) {
        return 100;
    }

    return duration;
}

export function LocationEntrance(props) {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'} onClick={() => props.onClick()}>
        <rect x={0} y={0} width={50} height={50} fill={"#161a3c"}
              className={'location-entrance-' + props.locationKey} />
        <text x={0} y={25} >{props.name}</text>
    </g>;
}

export function Character(props) {
    const {
        isMoving,
        from = {},
        to = {}
    } = props.movement;

    if (!isMoving) {
        return <circle cx={props.currentPosition.x} cy={props.currentPosition.y} r={10} fill={"#383ce5e"} />;
    }

    const duration = getDuration(to, from);

    return <Spring native
                   impl={TimingAnimation}
                   config={{ duration: duration, easing: Easing.linear }}
                   from={{ radius: 10, x: from.x, y: from.y }}
                   to={{ radius: 20, x: to.x, y: to.y }}
                   onRest={() => props.onMovementFinish(to.key)}>
        {({ radius, x, y }) => (
            <animated.circle cx={x} cy={y} r={radius} fill={"#383ce5e"} />
        )}
    </Spring>;
}