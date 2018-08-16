import {Component} from "react";
import React from "react";

export default class Activity extends Component {
    state = {
        activated: false,
    }

    activate() {
        if (!this.state.activated) {
            this.props.onFinish();
            this.setState({activated: true})
        }
    }

    textX(text) {
        return -(text.length * 4 / 2);
    }

    render() {
        const {
            x,
            y,
            activityKey,
            name
        } = this.props;

        const label = name + (this.state.activated ? ' (activated)' : '');

        return <g transform={'translate(' + x + ',' + y + ')'} onClick={() => this.activate()}>
            <rect x={0} y={0} width={40} height={60} rx={4} fill={"#bdbdbd"}
                  className={'activity-' + activityKey} />
            <text x={this.textX(label)} y={-15} >{label}</text>
        </g>;
    }
}
