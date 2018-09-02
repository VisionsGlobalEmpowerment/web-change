import {Component} from "react";
import React from "react";
import Wheel from "./ferris-wheel/Wheel";
import {getDataset, getLessonState, resetLessonState, setLessonState} from "../../../model/lessons";
import Reading from "../Reading";
import FerrisWheelModel from "../../../model/lessons/ferrisWheelModel";


export default class FerrisWheel extends Component {
    static lesson = 'ferris-wheel';

    state = {
        ferrisWheel: new FerrisWheelModel(),
        initialized: false,
    };

    reset() {
        resetLessonState(Reading.course, FerrisWheel.lesson);
        this.props.handleMove('fair');
    }

    async componentDidMount() {
        this.state.ferrisWheel.onInit(() => this.setState({initialized: true}));
        this.state.ferrisWheel.onWordChanged((currentWord) => this.setState({currentWord: currentWord}));

        return this.state.ferrisWheel.initItems(
            await getDataset(FerrisWheel.lesson),
            await getLessonState(Reading.course, FerrisWheel.lesson)
        );
    }

    render() {
        if (!this.state.initialized) {
            return <div />
        }

        return (
            <div className="card">
                <div className="card-header">
                    Ferris wheel ({this.state.currentWord})
                    <div className="float-right">
                        <a onClick={() => this.props.handleMove('fair')} href="#">Back</a>
                        &nbsp;
                        <a onClick={() => this.reset()} href="#">Reset</a>
                    </div>
                </div>

                <div className="card-body">
                    <svg viewBox="0 0 512 512" width={600} height={600}>
                        <Wheel ferrisWheel={this.state.ferrisWheel} />
                    </svg>
                </div>

            </div>
        );
    }
}
