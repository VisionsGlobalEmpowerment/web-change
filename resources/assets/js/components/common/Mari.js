import React from "react";
import {Component} from "react";
import {Group} from "react-konva";
import {KImage} from "../common";

export default class Mari extends Component {
    state = {
        state: 'default',
    };

    toState (state) {
        this.setState({state: state})
    }

    imageFromState(state) {
        switch (state) {
            case 'default':
                return "/raw/img/ferris-wheel/words/bat_default.png";
            case 'speaking':
                return "/raw/img/ferris-wheel/words/bat_done.png"
        }
    }

    render() {
        const {x, y} = this.props;
        return  <Group x={x} y={y}>
            <KImage image={this.imageFromState(this.state.state)}/>
        </Group>
    }
}
