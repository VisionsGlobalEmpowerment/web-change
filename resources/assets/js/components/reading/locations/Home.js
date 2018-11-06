import React, {Component} from 'react';
import axios from 'axios';
import SenoraVaca from "../../common/SenoraVaca";
import {pipe, Vera, withEffect, withRegistration} from "../../common";
import {getData} from "../../../model/cache";
import {Menu} from "../../common/MenuSvg";
import WordImage from "./home/WordImage";
import Syllable from "./home/Syllable";

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

const EnhancedSenoraVaca = pipe(
    withRegistration('senoraVaca'),
    withEffect("teacher"),
)(SenoraVaca);

const EnhancedVera = pipe(
    withRegistration('vera'),
)(Vera);

const EnhancedWordImage = pipe(
    withRegistration('wordImage'),
)(WordImage);

const EnhancedSyllable = pipe(
    withRegistration('syllable'),
)(Syllable);

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
                x: 857,
                y: 177
            }
        } = {width: 2520, height: 1080};

        const viewBox = this.props.viewBox;

        return (
            <svg viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`}  className={"location-home"}>
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
                </defs>

                <rect width={width} height={height} className={"location-background"} />

                <EnhancedWordImage x={500} y={50}/>
                <EnhancedSyllable x={500} y={260}/>

                <DoorWithEffect
                    x={1446} y={42}
                    locationKey={"map"}
                    name={"Door"}
                    onClick={() => this.props.handleMove("map")} />

                <EnhancedSenoraVaca
                    key={activity.key}
                    x={activity.x} y={activity.y}
                    onFinish={() => this.finishActivity(activity.key)}/>

                <EnhancedVera x={1350} y={400} />

                <Menu viewBox={viewBox} viewPort={this.props.viewPort}/>
            </svg>
        )
    }
}
