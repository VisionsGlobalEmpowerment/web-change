import React, {Component} from 'react';
import axios from 'axios';
import Activity from "../../common/Activity";

const Door = (props) => {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'}
              onClick={() => props.onClick()}
              className={'location-entrance-' + props.locationKey}>
        <rect x={0} y={0} width={50} height={50} rx={5} />
        <text x={5} y={25} fill={"black"}>{props.name}</text>
    </g>;
};

const Vera = (props) => {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'}
              className={'vera'}>
        <rect x={0} y={0} width={50} height={50} rx={5} />
        <text x={5} y={25} fill={"black"}>Vera</text>
    </g>;
};

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
                x: 350,
                y: 350
            }
        } = {width: 600, height: 600};

        return (
            <div className="card">
                <div className="card-header">Home location</div>

                <div className="card-body">
                    <svg viewBox={'0 0 ' + width + ' ' + height} className={"location-home"}>
                        <defs>
                            <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                                <rect width={width} height={height} fill={"#bbdefb"} />
                            </pattern>

                            <pattern id="door" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#00bcd4"} />
                            </pattern>

                            <pattern id="door-highlight" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#f0bcd4"} />
                            </pattern>

                            <pattern id="teacher" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#00bcd4"} />
                            </pattern>

                            <pattern id="teacher-highlight" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#f0bcd4"} />
                            </pattern>

                            <pattern id="vera" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={150} fill={"#ababab"} />
                            </pattern>
                        </defs>

                        <rect width={width} height={height} rx={14} className={"location-background"} />

                        <Door
                            x={50} y={350}
                            locationKey={"map"}
                            name={"Door"}
                            onClick={() => this.props.handleMove("map")} />

                        <Activity
                            key={activity.key}
                            x={activity.x} y={activity.y}
                            activityKey={activity.key}
                            name={activity.name}
                            text={activity.text}
                            onFinish={() => this.finishActivity(activity.key)}/>

                        <Vera x={100} y={400} />
                    </svg>
                </div>
            </div>
        )
    }
}
