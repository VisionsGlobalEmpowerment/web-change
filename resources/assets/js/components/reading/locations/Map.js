import React, { Component } from 'react';
import {LocationEntrance, withMovement, withEffect, pipe, Vera} from "../../common";

const EnhancedCharacter = pipe(
    withMovement,
    withEffect("entrance", 'onMovementFinish'),
)(Vera);

export default class Map extends Component {
    state = {
        movement: {isMoving: false}
    }

    locations = [{
        name: 'Home',
        key: 'home',
        x: 766,
        y: 595,
        width: 319,
        height: 300,
    }, {
        name: 'Fair',
        key: 'fair',
        x: 178,
        y: 895,
        width: 535,
        height: 465,
    }];

    paths = {
        home: [
            {x: 1040, y: 780},
            {x: 1010, y: 750},
        ],
        fair: [
            {x: 1040, y: 780},
            {x: 915, y: 850},
            {x: 950, y: 905},
            {x: 950, y: 965},
            {x: 860, y: 1035},
            {x: 765, y: 1177},
            {x: 565, y: 1199},
        ]
    };

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
            height,
            maxHeight = 870,
        } = {width: 1920, height: 1498};

        const home = this.getLocation('home');

        return (
            <div style={{margin: "0 auto", width: "60%"}}>
            <svg viewBox={'0 0 ' + width + ' ' + height} className={"location-map"} height={maxHeight}>
                <defs>
                    <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                        <image href={"/raw/img/map/background.png"} x={0} y={0} width={width} height={height} />
                    </pattern>

                    <pattern id="le-home" x={0} y={0} width={319} height={300} patternUnits="userSpaceOnUse">
                        <rect width={319} height={300} fillOpacity={0} />
                    </pattern>

                    <pattern id="le-home-highlight" x={0} y={0} width={319} height={300} patternUnits="userSpaceOnUse">
                        <image href={"/raw/img/map/casa.png"} x={0} y={0} width={319} height={300} />
                    </pattern>

                    <pattern id="le-fair" x={0} y={0} width={535} height={465} patternUnits="userSpaceOnUse">
                        <rect width={535} height={465} fillOpacity={0} />
                    </pattern>

                    <pattern id="le-fair-highlight" x={0} y={0} width={535} height={465} patternUnits="userSpaceOnUse">
                        <image href={"/raw/img/map/feria.png"} x={0} y={0} width={535} height={465} />
                    </pattern>

                    <pattern id="le-fair-locked" x={0} y={0} width={535} height={465} patternUnits="userSpaceOnUse">
                        <image href={"/raw/img/map/feria_locked.png"} x={0} y={0} width={535} height={465} />
                    </pattern>
                </defs>

                <rect width={width} height={height} className={"location-background"}/>

                {this.locations
                    .filter(location => location.hasOwnProperty('x'))
                    .map(location =>
                        <LocationEntrance
                            key={location.key}
                            location={location}
                            locked={this.isLocationLocked(location.key)}
                            onClick={() => this.moveTo(location.key)} />
                    )
                }

                {this.state.movement.isMoving ?
                    <EnhancedCharacter
                        path={this.state.movement.path}
                        onMovementFinish={() => this.onMovementFinish(this.state.movement.destination)}
                        scale={0.2}
                        x={0} y={0}
                    />
                    :
                    <Vera x={1040} y={780} scale={0.2}/>
                }

            </svg>
            </div>
        )
    }
}
