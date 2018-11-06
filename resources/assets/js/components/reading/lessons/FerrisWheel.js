import {Component} from "react";
import React from "react";
import Wheel from "./ferris-wheel/Wheel";
import {getDataset, getLessonState, resetLessonState} from "../../../model/lessons";
import Reading from "../Reading";
import FerrisWheelModel from "../../../model/lessons/ferrisWheelModel";
import {Stage, Layer} from 'react-konva';
import {KImage} from "../../common";
import {Back, Menu} from "../../common/MenuCanvas";
import {Score} from "./ferris-wheel/Score";

export const assets = [
    {url: '/raw/audio/ferris-wheel/instructions.mp3', size: 10, type: "audio"},

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
            return <Score points={this.state.ferrisWheel.getPoints()}
                          onNext={() => this.props.handleMove('fair')}
                          onReload={() => this.props.handleMove('ferris-wheel')}
            />
        }

        const {viewBox, viewPort} = this.props;

        return (
            <Stage x={-viewBox.x} y={-viewBox.y} width={viewPort.width} height={viewPort.height}
                scaleX={viewPort.width / viewBox.width} scaleY={viewPort.height / viewBox.height}>
                <Layer>
                    <KImage image={"/raw/img/ferris-wheel/background.png"}/>

                    <Wheel ferrisWheel={this.state.ferrisWheel} />

                    <Back viewBox={viewBox} viewPort={viewPort} onClick={() => this.props.handleMove('fair')} />
                    <Menu viewBox={viewBox} viewPort={viewPort} />
                </Layer>
            </Stage>
        );
    }
}
