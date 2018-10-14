import React, {Component} from 'react';
import axios from 'axios';
import Activity from "../../common/Activity";
import {pipe, Vera, withEffect} from "../../common";
import {getData} from "../../../model/cache";

const DoorComponent = (props) => {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'}
              onClick={() => props.onClick()}
              className={'location-entrance-' + props.locationKey}>
        <rect x={0} y={0} width={732} height={810} fillOpacity={1}/>
    </g>;
};

const DoorWithEffect = pipe(
    withEffect("door"),
)(DoorComponent);

const ActivityWithEffect = pipe(
    withEffect("teacher"),
)(Activity);

export default class Home extends Component {
    state = {
        movement: {isMoving: false},
    }

    finishActivity(activity) {
        return axios.post(`/courses/reading/activities/` + activity + '/finish')
            .then(res => {
                const progress = res.data;
                this.props.handleProgress(progress);
            })
    }

    render() {
        const {
            width,
            height,
            activity = {
                key: 'lesson-one-instructions',
                name: 'Lesson one instructions',
                text: [
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed mollis pellentesque metus, vel vehicula lectus.',
                    'Etiam sit amet sagittis lorem, quis convallis enim. Mauris ut mi a odio euismod pharetra quis sed est. Maecenas ut nulla nibh.',
                    'Suspendisse risus libero, fringilla ac aliquam non, vestibulum et neque. Etiam tristique condimentum ligula, eu consectetur enim sodales non.',
                    'Pellentesque a mi ac enim gravida blandit. Vestibulum laoreet a nisi sit amet venenatis.',
                    'Sed tincidunt, diam ut malesuada ullamcorper, justo urna fermentum dolor, consequat fringilla mi orci sed nibh.',
                    'Praesent nisl orci, condimentum sit amet nisi et, convallis vulputate nibh. Donec porttitor lectus libero, at lobortis lorem imperdiet non.',
                    'Fusce fringilla, mi nec pellentesque venenatis, libero elit vehicula orci, a pellentesque justo turpis at eros.',
                    'Sed at ex sit amet magna molestie ultricies. Etiam aliquam ante in sapien pulvinar, rutrum varius mi feugiat.',
                    'Fusce condimentum magna eu leo rhoncus, a consectetur nulla ullamcorper. Praesent auctor eros lectus, non volutpat ipsum elementum at.'
                ],
                x: 857,
                y: 177
            }
        } = {width: 2520, height: 1080};

        return (
            <g className={"location-home"}>
                <defs>
                    <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/casa_background.png")} x={0} y={0} width={width} height={height} />
                    </pattern>

                    <pattern id="door" x={0} y={0} width={732} height={810} patternUnits="userSpaceOnUse">
                        <rect width={732} height={810} fillOpacity={0} />
                    </pattern>

                    <pattern id="door-highlight" x={0} y={0} width={732} height={810} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/casa_door.png")} x={0} y={0} width={732} height={810} />
                    </pattern>

                    <pattern id="teacher" x={0} y={0} width={426} height={795} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/teacher.png")} x={0} y={0} width={426} height={795} />
                    </pattern>

                    <pattern id="teacher-highlight" x={0} y={0} width={434} height={808} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/teacher_two.png")} x={0} y={0} width={434} height={808} />
                    </pattern>
                </defs>

                <rect width={width} height={height} className={"location-background"} />

                <DoorWithEffect
                    x={1446} y={42}
                    locationKey={"map"}
                    name={"Door"}
                    onClick={() => this.props.handleMove("map")} />

                <ActivityWithEffect
                    key={activity.key}
                    x={activity.x} y={activity.y}
                    activityKey={activity.key}
                    name={activity.name}
                    text={activity.text}
                    onFinish={() => this.finishActivity(activity.key)}/>

                <Vera x={1350} y={400} />
            </g>
        )
    }
}
