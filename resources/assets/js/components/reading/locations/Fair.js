import React, { Component } from 'react';
import {LessonEntrance, LocationEntrance} from "../../common";
import {isProgressLessonCompleted} from "../../../model/lessons";

export default class Fair extends Component {

    locations = [{
        name: 'Map',
        key: 'map',
        x: 50,
        y: 50
    }];

    lessons = [{
        name: 'Ferris Wheel',
        key: 'ferris-wheel',
        x: 250,
        y: 250
    }, {
        name: 'Chapas',
        key: 'chapas',
        x: 450,
        y: 450
    }];

    render() {
        const {
            width,
            height
        } = {width: 600, height: 600};

        return (
            <div className="card">
                <div className="card-header">Fair location</div>

                <div className="card-body">
                    <svg viewBox={'0 0 ' + width + ' ' + height}>
                        <rect width={width} height={height} rx={14} fill={"#2196f3"} />

                        {this.locations
                            .map(location =>
                                <LocationEntrance
                                    key={location.key}
                                    x={location.x} y={location.y}
                                    locationKey={location.key}
                                    name={location.name}
                                    onClick={() => this.props.handleMove(location.key)} />
                            )
                        }

                        {this.lessons
                            .map(lesson =>
                                <LessonEntrance
                                    key={lesson.key}
                                    x={lesson.x} y={lesson.y}
                                    locationKey={lesson.key}
                                    name={lesson.name}
                                    completed={isProgressLessonCompleted(this.props.progress, lesson.key)}
                                    onClick={() => this.props.handleMove(lesson.key)} />
                            )
                        }
                    </svg>
                </div>
            </div>
        )
    }
}
