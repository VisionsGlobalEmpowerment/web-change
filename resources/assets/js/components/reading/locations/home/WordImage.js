import React from "react";
import {Component} from "react";

import {getData} from "../../../../model/cache";

export default class WordImage extends Component {
    state = {
        state: 'default',
    };

    toState (state) {
        this.setState({state: state})
    }

    imageData() {
        switch (this.state.state) {
            case 'uvas':
                return getData("/raw/img/ferris-wheel/words/Grapes.png");
            case 'cuchara':
                return getData("/raw/img/ferris-wheel/words/Spoon.png");
            case 'tenedor':
                return getData("/raw/img/ferris-wheel/words/Fork.png");
            default:
                return '';
        }
    }

    render() {
        const {
            x,
            y,
        } = this.props;

        const transparent = this.state.state === 'default';

        return <g>
            <defs>
                <pattern id="word" width={205} height={209} patternUnits="userSpaceOnUse">
                    <image xlinkHref={this.imageData()} />
                </pattern>
            </defs>
            <g transform={`translate(${x},${y})`}>
                <rect width={205} height={209} className={'word-image'} fill={'url(#word)'} fillOpacity={transparent ? 0 : 1} />
            </g>
        </g>;
    }
}
