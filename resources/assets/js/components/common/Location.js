import React from "react";

export function withBackgroundAudio(WrappedComponent, audioFilepath) {
    return class extends React.Component {
        audio = new Audio(audioFilepath);

        componentDidMount() {
            this.audio.addEventListener('timeupdate', function() {
                const buffer = .44
                if (this.currentTime > this.duration - buffer) {
                    this.currentTime = 0;
                    this.play()
                }}, false);

            return this.audio.play();
        }

        componentWillUnmount() {
            return this.audio.pause();
        }

        render() {
            return <WrappedComponent {...this.props} />;
        }
    };
}
