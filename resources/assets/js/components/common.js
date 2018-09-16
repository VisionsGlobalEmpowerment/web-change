import {animated, Spring} from "react-spring";
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'
import React from "react";
import {movementSpeed} from "./animations";

function getDuration(to, from) {
    const duration = Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2));
    if (duration < 10) {
        return 10 * movementSpeed;
    }

    return duration * movementSpeed;
}

export function LocationEntrance(props) {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'}
              onClick={() => props.locked ? false : props.onClick()}
              className={'location-entrance-' + props.locationKey + (props.locked ? '-locked' : '')}
              fill={"#00bcd4"}>
        <rect x={0} y={0} width={50} height={50} rx={5} />
        <text x={5} y={25} fill={"black"}>{props.name}</text>
    </g>;
}

export function LessonEntrance(props) {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'} onClick={() => props.onClick()}>
        <rect x={0} y={0} width={50} height={50} rx={5} fill={"#00bcd4"}
              className={'location-entrance-' + props.locationKey} />
        <text x={5} y={25} >{props.name} {props.completed && "(c)"}</text>
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

export function ModalText(props) {
    return <div className="modal-static">
        <div className="modal" tabIndex="-1" role="dialog">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">{props.name}</h5>
                        <button type="button" className="close" aria-label="Close" onClick={props.onHide}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        <p>{props.text}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" onClick={props.onHide}>Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
}
