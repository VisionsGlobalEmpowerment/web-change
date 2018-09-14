import {Component} from "react";
import React from "react";

export default class Activity extends Component {
    state = {
        activated: false,
        currentTextIndex: 0,
    };

    activate() {
        if (!this.state.activated) {
            this.props.onFinish();
            this.setState({activated: true});

            this.scheduleNextText();
        }
    }

    currentTextLengthInMs() {
        const currentText = this.props.text[this.state.currentTextIndex];
        return 500 + currentText.length * 100;
    }

    scheduleNextText() {
        setTimeout(() => {
            this.showNextText();
        }, this.currentTextLengthInMs());
    }

    showNextText() {
        const {text} = this.props;

        const nextIndex = this.state.currentTextIndex + 1;

        if (nextIndex >= text.length) {
            this.deactivate();
            return;
        }

        this.setState({currentTextIndex: nextIndex});
        this.scheduleNextText();
    }

    deactivate() {
        this.setState({activated: false, currentTextIndex: 0})
    }

    textX(text) {
        return -(text.length * 4 / 2);
    }

    render() {
        const {
            x,
            y,
            activityKey,
            name,
            text
        } = this.props;

        const label = name + (this.state.activated ? ' (activated)' : '');

        return <g transform={'translate(' + x + ',' + y + ')'} onClick={() => this.activate()}>
            <rect x={0} y={0} width={40} height={60} rx={4} fill={"#bdbdbd"}
                  className={'activity-' + activityKey} />
            <text x={this.textX(label)} y={-15} >{label}</text>
            {this.state.activated &&
            (<g transform={'translate(-100, -200)'}>
                <rect width={250} height={150} fill={"#5d8d9d"}/>
                <foreignObject width={250} height={150} requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <p style={{textAlign: "center", verticalAlign: "middle"}} xmlns="http://www.w3.org/1999/xhtml">{text[this.state.currentTextIndex]}</p>
                </foreignObject>
            </g>) }
        </g>;
    }
}
