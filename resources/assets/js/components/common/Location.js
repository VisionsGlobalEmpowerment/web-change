import React from "react";
import {getBackgroundAudio} from "../../model/cache";

export const withBackgroundAudio = (audioFilepath) => (WrappedComponent) => {
    return class extends React.Component {

        componentDidMount() {
            const audio = getBackgroundAudio(audioFilepath);
            return audio.play();
        }

        componentWillUnmount() {
            const audio = getBackgroundAudio(audioFilepath);
            return audio.pause();
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}

export const backgroundAlign = Object.freeze({
    bottomLeft: "bottom-left",
    bottomCenter: "bottom-center",
    bottomRight: "bottom-right",
    center: "bottom-center",
});

export const withSvgViewport = (config) => (WrappedComponent) => {
    return class extends React.Component {
        state = { width: 0, height: 0, viewBoxWidth: 0, viewBoxHeight: 0 };

        componentDidMount() {
            this.updateWindowDimensions();
            window.addEventListener('resize', this.updateWindowDimensions.bind(this));
        }

        componentWillUnmount() {
            window.removeEventListener('resize', this.updateWindowDimensions.bind(this));
        }

        updateWindowDimensions() {
            const {
                width = 1920,
                height = 1080
            } = config;

            const originalRatio = width / height;
            const windowRatio = window.innerWidth / window.innerHeight;
            if (originalRatio < windowRatio) {
                this.setState({
                    width: window.innerWidth, height: window.innerHeight,
                    viewBoxWidth: width, viewBoxHeight: height * originalRatio / windowRatio
                });
            } else {
                this.setState({
                    width: window.innerWidth, height: window.innerHeight,
                    viewBoxWidth: width * windowRatio / originalRatio, viewBoxHeight: height
                });
            }
        }

        computeX() {
            const {
                width = 1920,
                align = backgroundAlign.bottomCenter
            } = config;

            switch (align) {
                case backgroundAlign.bottomCenter:
                case backgroundAlign.center:
                    return (width - this.state.viewBoxWidth) / 2;
                case backgroundAlign.bottomRight:
                    return width - this.state.viewBoxWidth;
                case backgroundAlign.bottomLeft:
                default:
                    return 0;
            }
        }

        computeY() {
            const {
                height = 1080,
                align = backgroundAlign.bottomCenter
            } = config;

            switch (align) {
                case backgroundAlign.center:
                    return (height - this.state.viewBoxHeight) / 2;
                case backgroundAlign.bottomRight:
                case backgroundAlign.bottomCenter:
                case backgroundAlign.bottomLeft:
                default:
                    return height - this.state.viewBoxHeight;
            }
        }

        render() {
            const viewBox = {
                x: this.computeX(),
                y: this.computeY(),
                width: this.state.viewBoxWidth,
                height: this.state.viewBoxHeight,
            };

            const viewPort = {
                width: this.state.width,
                height: this.state.height,
            };

            return <WrappedComponent viewBox={viewBox} viewPort={viewPort} {...this.props} />;
        }
    };
}
