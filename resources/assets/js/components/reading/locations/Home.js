import React, {Component} from 'react';
import axios from 'axios';
import {Character, LocationEntrance} from "../../common";
import Activity from "../../common/Activity";

export default class Home extends Component {
    state = {
        movement: {isMoving: false},
        currentActivity: null,
    }

    locations = [{
        name: 'Map',
        key: 'map',
        x: 50,
        y: 50
    }];


    activities = [{
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
    }];

    isAvailable = (location) => {
        if (this.props.progress.availableLocations == null) {
            return "n/a";
        }

        return this.props.progress.availableLocations.includes(location) ? "available" : "n/a";
    }

    finishActivity(activity) {
        return axios.post(`/courses/reading/activities/` + activity + '/finish')
            .then(res => {
                const progress = res.data;
                this.props.handleProgress(progress);
            })
    }

    getLocation = (key) => {
        return this.locations.find(location => location.key === key);
    }

    moveTo = (locationKey) => {
        const movement = {
            isMoving: true,
            from: this.getLocation('map'),
            to: this.getLocation(locationKey),
        }
        this.setState({movement})
    }

    onMovementFinish = (destination) => {
        if (!this.props.handleMove(destination)) {
            const movement = {isMoving: false}
            this.setState({movement})
        }
    }


    render() {
        const {
            width,
            height
        } = {width: 600, height: 600};

        const map = this.locations[0];

        return (
            <div className="card">
                <div className="card-header">Home location</div>

                <div className="card-body">
                    <svg viewBox={'0 0 ' + width + ' ' + height}>
                        <rect width={width} height={height} rx={14} fill={"#bbdefb"} />

                        {this.locations
                            .filter(location => location.hasOwnProperty('x'))
                            .map(location =>
                                <LocationEntrance
                                    key={location.key}
                                    x={location.x} y={location.y}
                                    locationKey={location.key}
                                    name={location.name}
                                    onClick={() => this.moveTo(location.key)} />
                            )
                        }

                        {this.activities.map(activity =>
                            <Activity
                                key={activity.key}
                                x={activity.x} y={activity.y}
                                activityKey={activity.key}
                                name={activity.name}
                                text={activity.text}
                                onFinish={() => this.finishActivity(activity.key)}/>
                        )}

                        <Character
                            movement={this.state.movement}
                            currentPosition={ {x: map.x, y: map.y} }
                            onMovementFinish={this.onMovementFinish} />
                    </svg>
                </div>
            </div>
        )
    }
}
