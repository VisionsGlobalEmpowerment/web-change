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

    render() {
        const {
            x,
            y,
            activityKey,
            name,
            text
        } = this.props;

        return <g transform={'translate(' + x + ',' + y + ')'} onClick={() => this.activate()}>
            <rect x={0} y={0} width={40} height={60} rx={4} fill={"#161a3c"}
                  className={'activity-' + activityKey} />
            <text x={0} y={25} >{name}{this.state.activated ? '(activated)' : ''}</text>
        </g>;
    }
}