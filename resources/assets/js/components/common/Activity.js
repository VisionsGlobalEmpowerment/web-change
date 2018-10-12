import {Component} from "react";
import React from "react";

export default class Activity extends Component {
    state = {
        activated: false,
        currentTextIndex: 0,
    };

    activate() {
        if (this.props.onClick) {
            this.props.onClick();
        }

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

    render() {
        const {
            x,
            y,
            activityKey,
            text
        } = this.props;

        return <g transform={'translate(' + x + ',' + y + ')'} onClick={() => this.activate()}>
            <rect x={0} y={0} width={426} height={794}
                  className={'activity-' + activityKey} />
            {this.state.activated &&
            (<g transform={'translate(400, -150)'}>
                <image xlinkHref={"/raw/img/chat_bubble_big.png"} x={0} y={0} width={577} height={474} />
                <foreignObject x={100} y={100} width={400} height={350} requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility">
                    <p style={{textAlign: "center", verticalAlign: "middle", fontSize: "24px"}} xmlns="http://www.w3.org/1999/xhtml">{text[this.state.currentTextIndex]}</p>
                </foreignObject>
            </g>) }
        </g>;
    }
}
