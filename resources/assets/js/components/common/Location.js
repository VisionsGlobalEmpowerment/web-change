import React from "react";
import {getBackgroundAudio, getData} from "../../model/cache";

export function withBackgroundAudio(WrappedComponent, audioFilepath) {
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
