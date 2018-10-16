import React, { Component } from 'react';
import {pipe, Vera, withEffect} from "../../common";
import {isProgressLessonCompleted} from "../../../model/lessons";
import {getData} from "../../../model/cache";

const ExitComponent = (props) => {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'}
              onClick={() => props.onClick()}
              className={'location-entrance-' + props.locationKey}>
        <rect x={0} y={0} width={241} height={231} fillOpacity={1}/>
    </g>;
};

const ExitWithEffect = pipe(
    withEffect("entrance"),
)(ExitComponent);

const WheelComponent = (props) => {
    return <g transform={'translate(' + props.x + ',' + props.y + ')'}
              onClick={() => props.onClick()}
              className={'location-entrance-' + props.locationKey}>
        <rect x={0} y={0} width={708} height={778} fillOpacity={1}/>
    </g>;
};

const WheelWithEffect = pipe(
    withEffect("entrance"),
)(WheelComponent);

export default class Fair extends Component {

    render() {
        const {
            width,
            height
        } = {width: 1920, height: 1080};

        const viewBox = this.props.viewBox;
        return (
            <svg viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} className={"location-fair"}>
                <defs>
                    <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/feria/background.png")} x={0} y={0} width={width} height={height} />
                    </pattern>

                    <pattern id="exit" x={0} y={0} width={241} height={231} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/feria/back.png")} x={0} y={0} width={241} height={231} />
                    </pattern>

                    <pattern id="exit-highlight" x={0} y={0} width={241} height={231} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/feria/back_active.png")} x={0} y={0} width={241} height={231} />
                    </pattern>

                    <pattern id="wheel" x={0} y={0} width={708} height={778} patternUnits="userSpaceOnUse">
                        <rect width={708} height={778} fillOpacity={0} />
                    </pattern>

                    <pattern id="wheel-highlight" x={0} y={0} width={708} height={778} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/feria/wheel.png")} x={0} y={0} width={708} height={778} />
                    </pattern>
                </defs>

                <rect width={width} height={height} className={"location-background"}/>

                <ExitWithEffect
                    x={1600} y={800}
                    locationKey={'map'}
                    onClick={() => this.props.handleMove('map')} />

                <WheelWithEffect
                    x={467} y={105}
                    locationKey={'ferris-wheel'}
                    completed={isProgressLessonCompleted(this.props.progress, 'ferris-wheel')}
                    onClick={() => this.props.handleMove('ferris-wheel')} />

                <Vera x={1100} y={650} scale={0.55} />
            </svg>
        )
    }
}
