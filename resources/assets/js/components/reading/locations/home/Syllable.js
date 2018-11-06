import React from "react";
import {Component} from "react";

export default class Syllable extends Component {
    state = {
        state: 'default',
        params: {},
    };

    toState (state, params) {
        this.setState({state: state, params: params})
    }

    render() {
        const {
            x,
            y,
        } = this.props;

        const transparent = this.state.state === 'default';

        return <g>
            <g transform={`translate(${x},${y})`}>
                {!transparent &&
                <foreignObject width={200} height={100} requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                        <p style={{textAlign: "center", verticalAlign: "middle", fontFamily: "Luckiest Guy", fontSize: "72px", textShadow: "#4a4a4a 0.05em 0.05em 0.05em", color: "white"}} xmlns="http://www.w3.org/1999/xhtml">{this.state.params.text}</p>
                </foreignObject>}
            </g>
        </g>;
    }
}
