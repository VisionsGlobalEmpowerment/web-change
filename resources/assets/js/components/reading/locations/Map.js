import React, { Component } from 'react';
import { LocationEntrance, Character } from "../../common";

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

        const home = this.getLocation('home');

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

                        <Character
                            movement={this.state.movement}
                            currentPosition={ {x: home.x, y: home.y} }
                            onMovementFinish={this.onMovementFinish} />
                    </svg>
                </div>

            </div>
        )
    }
}