import {Component} from "react";
import React from "react";
import Wheel from "./ferris-wheel/Wheel";
import {getDataset, getLessonState, resetLessonState} from "../../../model/lessons";
import Reading from "../Reading";
import FerrisWheelModel from "../../../model/lessons/ferrisWheelModel";
import {play} from "../../sounds";


export default class FerrisWheel extends Component {
    static lesson = 'ferris-wheel';
    static status = Object.freeze({"new": 1, "initialized": 2, "started": 3, "finished": 4});

    state = {
        ferrisWheel: new FerrisWheelModel(),
        status: FerrisWheel.status.new,
    };

    reset() {
        resetLessonState(Reading.course, FerrisWheel.lesson);
        this.props.handleMove('fair');
    }

    start() {
        this.state.ferrisWheel.start();
        this.setState(previousState => {
            if (previousState.status !== FerrisWheel.status.finished) {
                return {status: FerrisWheel.status.started};
            }
        });
    }

    async componentDidMount() {
        this.state.ferrisWheel.register('onInit', () => this.setState({status: FerrisWheel.status.initialized}));
        this.state.ferrisWheel.register('onWordChanged', (currentWord) => this.setState({currentWord: currentWord}));
        this.state.ferrisWheel.register('onFinish',() => {
            this.setState({status: FerrisWheel.status.finished})
        });

        this.state.ferrisWheel.register('onFail', () => play("fail"));
        this.state.ferrisWheel.register('onSuccess', () => play("success"));
        this.state.ferrisWheel.register('onStart', () => play("start"));
        this.state.ferrisWheel.register('onFinish', () => play("finish"));

        return this.state.ferrisWheel.initItems(
            await getDataset(FerrisWheel.lesson),
            await getLessonState(Reading.course, FerrisWheel.lesson)
                .then(state => state.hasOwnProperty('completed') ? state.completed : false)
        );
    }

    render() {

        if (this.state.status === FerrisWheel.status.new) {
            return <div />
        } else if (this.state.status === FerrisWheel.status.initialized) {
            return (
                <div className="card">
                    <div className="card-header">
                        Ferris wheel
                        <div className="float-right">
                            <a onClick={() => this.props.handleMove('fair')} href="#">Back</a>
                        </div>
                    </div>
                    <div className="card-body">
                        <button type="button" className="btn btn-primary" onClick={this.start.bind(this)}>Start</button>
                    </div>
                </div>
            );
        } else if (this.state.status === FerrisWheel.status.finished) {
            const points = this.state.ferrisWheel.getPoints();
            return (
                <div className="card">
                    <div className="card-header">
                        Ferris wheel
                        <div className="float-right">
                            <a onClick={() => this.props.handleMove('fair')} href="#">Back</a>
                            &nbsp;
                            <a onClick={() => this.reset()} href="#">Reset</a>
                        </div>
                    </div>
                    <div className="card-body">
                        Game stats:
                        {points.score} / {points.max}
                    </div>
                </div>
            )
        }

        //const width = 1728;
        //const height = 972;

        const width = 1920;
        const height = 1080;

        return (
            <div className="card">
                <div className="card-header">
                    Ferris wheel ({this.state.currentWord})
                    <div className="float-right">
                        <a onClick={() => this.props.handleMove('fair')} href="#">Back</a>
                    </div>
                </div>

                <div className="card-body">
                    <svg viewBox={'0 0 ' + width + ' ' + height} width={width} height={height} className={"location-ferris-wheel"}>
                        <defs>
                            <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                                <image href={"/raw/img/ferris-wheel/background.png"} x={0} y={0} width={width} height={height} />
                            </pattern>

                            <pattern id="center" x={0} y={0} width={260} height={260} patternUnits="userSpaceOnUse">
                                <image href={"/raw/img/ferris-wheel/ferris_wheel_03.png"} x={0} y={0} width={250} height={250} />
                            </pattern>

                            <pattern id="stand" x={0} y={0} width={359} height={527} patternUnits="userSpaceOnUse">
                                <image href={"/raw/img/ferris-wheel/ferris_wheel_02.png"} x={0} y={0} width={359} height={527} />
                            </pattern>

                            <pattern id="wheel" x={0} y={0} width={772} height={772} patternUnits="userSpaceOnUse">
                                <image href={"/raw/img/ferris-wheel/ferris_wheel_01.png"} x={0} y={0} width={772} height={772} />
                            </pattern>
                        </defs>

                        <rect width={width} height={height} className={"location-background"}/>

                        <Wheel ferrisWheel={this.state.ferrisWheel} />
                    </svg>
                </div>

            </div>
        );
    }
}
