import {Component} from "react";
import React from "react";
import Wheel from "./ferris-wheel/Wheel";
import {getDataset, getLessonState, resetLessonState} from "../../../model/lessons";
import Reading from "../Reading";
import FerrisWheelModel from "../../../model/lessons/ferrisWheelModel";
import {play} from "../../sounds";
import {getAudio, getData} from "../../../model/cache";

export const assets = [
    {url: '/raw/audio/ferris-wheel/bat.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/ferris-wheel/broccoli.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/ferris-wheel/casa.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/ferris-wheel/crocodile.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/ferris-wheel/dinosaur.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/ferris-wheel/feria.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/ferris-wheel/orange.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/ferris-wheel/whale.mp3', size: 1, type: "audio"},

    {url: '/raw/img/ferris-wheel/background.png', size: 10, type: "image"},
    {url: '/raw/img/ferris-wheel/cloud_01.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/cloud_02.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/cloud_03.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/cloud_04.png', size: 1, type: "image"},

    {url: '/raw/img/ferris-wheel/ferris_wheel_01.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/ferris_wheel_02.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/ferris_wheel_03.png', size: 1, type: "image"},

    {url: '/raw/img/ferris-wheel/words/bat_alert.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/bat_default.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/bat_done.png', size: 1, type: "image"},

    {url: '/raw/img/ferris-wheel/words/broccoli_alert.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/broccoli_default.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/broccoli_done.png', size: 1, type: "image"},

    {url: '/raw/img/ferris-wheel/words/crocodile_alert.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/crocodile_default.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/crocodile_done.png', size: 1, type: "image"},

    {url: '/raw/img/ferris-wheel/words/dinosaur_alert.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/dinosaur_default.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/dinosaur_done.png', size: 1, type: "image"},

    {url: '/raw/img/ferris-wheel/words/orange_alert.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/orange_default.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/orange_done.png', size: 1, type: "image"},

    {url: '/raw/img/ferris-wheel/words/whale_alert.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/whale_default.png', size: 1, type: "image"},
    {url: '/raw/img/ferris-wheel/words/whale_done.png', size: 1, type: "image"},
];

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

    playAWord(word) {
        setTimeout(() => {
            const audio = getAudio(`/raw/audio/ferris-wheel/${word}.mp3`);
            return audio.play();
        }, 300);
    }

    async componentDidMount() {
        this.state.ferrisWheel.register('onInit', () => {
            this.state.ferrisWheel.start();
            this.setState(previousState => {
                if (previousState.status !== FerrisWheel.status.finished) {
                    return {status: FerrisWheel.status.started};
                }
            });
        });
        this.state.ferrisWheel.register('onWordChanged', (currentWord) => this.setState({currentWord: currentWord}));
        this.state.ferrisWheel.register('onFinish',() => {
            this.setState({status: FerrisWheel.status.finished})
        });

        this.state.ferrisWheel.register('onFail', () => play("fail"));
        this.state.ferrisWheel.register('onSuccess', () => play("success"));
        this.state.ferrisWheel.register('onStart', () => play("start"));
        this.state.ferrisWheel.register('onFinish', () => play("finish"));

        this.state.ferrisWheel.register('onWordChanged', (currentWord) => this.playAWord(currentWord));

        return this.state.ferrisWheel.initItems(
            await getDataset(FerrisWheel.lesson),
            await getLessonState(Reading.course, FerrisWheel.lesson)
                .then(state => state.hasOwnProperty('completed') ? state.completed : false)
        );
    }

    componentWillUnmount() {
        this.state.ferrisWheel.abort();
    }

    render() {
        if (this.state.status === FerrisWheel.status.new) {
            return <div />
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

        const width = 1920;
        const height = 1080;
        const viewBox = this.props.viewBox;

        return (
            <svg viewBox={`${viewBox.x} ${viewBox.y} ${viewBox.width} ${viewBox.height}`} className={"location-ferris-wheel"}>
                <defs>
                    <pattern id="background" x="0" y="0" width={width} height={height} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/ferris-wheel/background.png")} x={0} y={0} width={width} height={height} />
                    </pattern>

                    <pattern id="center" x={0} y={0} width={260} height={260} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/ferris-wheel/ferris_wheel_03.png")} x={0} y={0} width={250} height={250} />
                    </pattern>

                    <pattern id="stand" x={0} y={0} width={359} height={527} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/ferris-wheel/ferris_wheel_02.png")} x={0} y={0} width={359} height={527} />
                    </pattern>

                    <pattern id="wheel" x={0} y={0} width={772} height={772} patternUnits="userSpaceOnUse">
                        <image xlinkHref={getData("/raw/img/ferris-wheel/ferris_wheel_01.png")} x={0} y={0} width={772} height={772} />
                    </pattern>
                </defs>

                <rect width={width} height={height} className={"location-background"}/>

                <g transform={`translate(${viewBox.width - 120} ${viewBox.y + 20})`} onClick={() => this.props.handleMove('fair')}>
                    <circle cx={24} cy={24} r={30} fill={'#ffffff'}/>
                    <path d="M40 22H15.66l11.17-11.17L24 8 8 24l16 16 2.83-2.83L15.66 26H40v-4z"/>
                </g>

                <Wheel ferrisWheel={this.state.ferrisWheel} />
            </svg>
        );
    }
}
