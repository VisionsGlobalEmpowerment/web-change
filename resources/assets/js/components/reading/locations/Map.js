import React, { Component } from 'react';
import {LocationEntrance, Character, withMovement} from "../../common";


const MovingCharacter = withMovement(Character);

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

    paths = {
        home: [
            {x: 250, y: 250},
            {x: 250, y: 250},
        ],
        fair: [
            {x: 250, y: 250},
            {x: 200, y: 250},
            {x: 200, y: 300},
            {x: 150, y: 300},
            {x: 150, y: 350},
            {x: 100, y: 350},
            {x: 100, y: 400},
            {x: 50, y: 400},
            {x: 50, y: 450},
        ]
    }

    getLocation = (key) => {
        return this.locations.find(location => location.key === key);
    }

    isLocationLocked = (key) => {
        if (this.props.progress.availableLocations == null) {
            return true;
        }

        return !this.props.progress.availableLocations.includes(key);
    }

    moveTo = (locationKey) => {
        const movement = {
            isMoving: true,
            path: this.paths[locationKey],
            destination: locationKey,
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

        const home = this.getLocation('home');

        return (
            <div className="card">
                <div className="card-header">Map location</div>

                <div className="card-body">
                    <svg viewBox={'0 0 ' + width + ' ' + height} className={"location-map"}>
                        <defs>
                            <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                                <rect width={width} height={height} fill={"#2196f3"} />
                            </pattern>

                            <pattern id="le-home" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#00bcd4"} />
                            </pattern>

                            <pattern id="le-home-highlight" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#f0bcd4"} />
                            </pattern>

                            <pattern id="le-fair" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#00bcd4"} />
                            </pattern>

                            <pattern id="le-fair-highlight" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#f0bcd4"} />
                            </pattern>

                            <pattern id="le-fair-locked" x={0} y={0} width={50} height={50} patternUnits="userSpaceOnUse">
                                <rect width={50} height={50} fill={"#ababab"} />
                            </pattern>
                        </defs>

                        <rect width={width} height={height} rx={14} className={"location-background"}/>

                        {this.locations
                            .filter(location => location.hasOwnProperty('x'))
                            .map(location =>
                                <LocationEntrance
                                    key={location.key}
                                    x={location.x} y={location.y}
                                    locationKey={location.key}
                                    name={location.name}
                                    locked={this.isLocationLocked(location.key)}
                                    onClick={() => this.moveTo(location.key)} />
                            )
                        }

                        {this.state.movement.isMoving ?
                            <MovingCharacter
                                path={this.state.movement.path}
                                onMovementFinish={() => this.onMovementFinish(this.state.movement.destination)}/>
                            :
                            <circle cx={home.x} cy={home.y} r={10} fill={"#383ce5e"} />
                        }

                    </svg>
                </div>
            </div>
        )
    }
}
