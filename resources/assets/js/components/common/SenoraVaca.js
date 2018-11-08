import {Component} from "react";
import React from "react";
import {getData} from "../../model/cache";
import FerrisWheelIntro from "../../model/lessons/ferrisWheelIntro";

export default class SenoraVaca extends Component {
    state = {
        activated: false,
        state: 'default',
    };

    toState (state) {
        this.setState({state: state})
    }

    async toAnimation (state) {
        return Promise.resolve();
    }

    activate() {
        if (this.props.onClick) {
            this.props.onClick();
        }

        if (!this.state.activated) {
            this.props.onFinish();
            this.setState({activated: true});
            const ferrisWheelIntro = new FerrisWheelIntro();
            ferrisWheelIntro.start();
        }
    }

    render() {
        const {
            x,
            y,
        } = this.props;

        const transform = this.state.state === 'default' || true ?
            'translate(' + x + ',' + y + ')':
            'translate(' + x + ',' + y + ')' + ' scale(-1, 1) translate(-426, 0)';

        return <g>
            <defs>
                <pattern id="teacher" x={0} y={0} width={426} height={795} patternUnits="userSpaceOnUse">
                    <image xlinkHref={getData("/raw/img/teacher.png")} x={0} y={0} width={426} height={795} />
                </pattern>

                <pattern id="teacher-highlight" x={0} y={0} width={434} height={808} patternUnits="userSpaceOnUse">
                    <image xlinkHref={getData("/raw/img/teacher_two.png")} x={0} y={0} width={434} height={808} />
                </pattern>
            </defs>
            <g transform={transform} onClick={() => this.activate()}>
                <rect x={0} y={0} width={426} height={794} className={'senora-vaca'} />
            </g>
        </g>;
    }
}
