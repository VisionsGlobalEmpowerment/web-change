import React, { Component } from 'react';
import { Spring, animated, interpolate, config } from 'react-spring'
import { TimingAnimation, Easing } from 'react-spring/dist/addons.cjs'

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

        const {
            isMoving,
            from = {},
            to = {}
        } = this.state.movement

        const character = isMoving ?
            (<Spring native
                     impl={TimingAnimation}
                     config={{ duration: 3000, easing: Easing.linear }}
                     from={{ radius: 10, x: from.x, y: from.y }}
                     to={{ radius: 20, x: to.x, y: to.y }}
                     onRest={() => this.onMovementFinish(to.key)}>
                {({ radius, x, y }) => (
                    <animated.circle cx={x} cy={y} r={radius} fill={"#383ce5e"} />
                )}
            </Spring>) : (<circle cx={250} cy={250} r={10} fill={"#383ce5e"} />)
        return (
            <div className="card">
                <div className="card-header">Map location</div>

                <div className="card-body">
                    <svg width={width} height={height}>
                        <rect width={width} height={height} rx={14} fill={"#272b4d"} />

                        {character}

                        <rect x={250} y={250} width={50} height={50} fill={"#161a3c"}
                              onClick={() => this.moveTo('home')}
                              className={'location-entrance-home'} />

                        <rect x={50} y={450} width={50} height={50} fill={"#161a3c"}
                              onClick={() => this.moveTo('fair')}
                              className={'location-entrance-fair'} />
                    </svg>
                </div>

            </div>
        )
    }
}