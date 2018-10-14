import React, { Component } from 'react';
import {LocationEntrance, withMovement, withEffect, pipe, Vera} from "../../common";
import {getData} from "../../../model/cache";

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
        x: 731,
        y: 340,
        width: 433,
        height: 380,
    }, {
        name: 'Fair',
        key: 'fair',
        x: 183,
        y: 638,
        width: 433,
        height: 380,
    }];

    paths = {
        home: [
            {x: 1045, y: 540},
            {x: 975, y: 495},
        ],
        fair: [
            {x: 1045, y: 540},
            {x: 915, y: 601},
            {x: 950, y: 646},
            {x: 870, y: 726},
            {x: 850, y: 813},
            {x: 565, y: 835},
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
        } = {width: 1920, height: 1080};

        return (
            <g className={"location-map"}>
                <defs>
                    <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/map/background.png")} x={0} y={0} width={width} height={height} />
                    </pattern>

                    <pattern id="le-home" x={0} y={0} width={433} height={380} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/map/casa_01.png")} x={0} y={0} width={433} height={380} />
                    </pattern>

                    <pattern id="le-home-highlight" x={0} y={0} width={433} height={380} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/map/casa_02.png")} x={0} y={0} width={433} height={380} />
                    </pattern>

                    <pattern id="le-fair" x={0} y={0} width={433} height={380} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/map/feria_01.png")} x={0} y={0} width={433} height={380} />
                    </pattern>

                    <pattern id="le-fair-highlight" x={0} y={0} width={433} height={380} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/map/feria_02.png")} x={0} y={0} width={433} height={380} />
                    </pattern>

                    <pattern id="le-fair-locked" x={0} y={0} width={535} height={465} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/map/feria_locked.png")} x={0} y={0} width={535} height={465} />
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
                    <Vera x={1045} y={540} scale={0.2}/>
                }

            </g>
        )
    }
}
