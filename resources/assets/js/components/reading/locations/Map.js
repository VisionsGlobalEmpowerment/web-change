import React, { Component } from 'react';
import { Spring, animated, interpolate, config } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'

function getDuration(to, from) {
    const duration = Math.sqrt(Math.pow((to.x - from.x), 2) + Math.pow((to.y - from.y), 2)) * 10;
    if (duration < 100) {
        return 100;
    }

    return duration;
}

function LocationEntrance(props) {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'} onClick={() => props.onClick()}>
        <rect x={0} y={0} width={50} height={50} fill={"#161a3c"}
              className={'location-entrance-' + props.locationKey} />
        <text x={0} y={25} >{props.name}</text>
    </g>;
}

function Character(props) {
    const {
        isMoving,
        from = {},
        to = {}
    } = props.movement;

    if (!isMoving) {
        return <circle cx={250} cy={250} r={10} fill={"#383ce5e"} />;
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

export default class Map extends Component {
    state = {
        movement: {isMoving: false}
    }

    locations = [{
        name: 'Home',
        key: 'home',
        x: 250,
        y: 250
    }, {
        name: 'Fair',
        key: 'fair',
        x: 50,
        y: 450
    }, {
        'name': 'Cafe',
        'key': 'cafe'
    }, {
        'name': 'Concert hall',
        'key': 'concert-hall'
    }, {
        'name': 'Shopping Mall',
        'key': 'shopping-mall'
    }, {
        'name': 'Stadium',
        'key': 'stadium'
    }, {
        'name': 'Movie Theater',
        'key': 'movie-theater'
    }, {
        'name': 'Park',
        'key': 'Park'
    }];

    getLocation = (key) => {
        return this.locations.find(location => location.key === key);
    }

    isAvailable = (location) => {
        if (this.props.progress.availableLocations == null) {
            return "n/a";
        }

        return this.props.progress.availableLocations.includes(location) ? "available" : "n/a";
    }

    moveTo = (locationKey) => {
        const movement = {
            isMoving: true,
            from: this.getLocation('home'),
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

        return (
            <div className="card">
                <div className="card-header">Map location</div>

                <div className="card-body">
                    <svg viewBox={'0 0 ' + width + ' ' + height}>
                        <rect width={width} height={height} rx={14} fill={"#272b4d"} />

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

                        <Character movement={this.state.movement} onMovementFinish={this.onMovementFinish}/>
                    </svg>
                </div>

            </div>
        )
    }
}