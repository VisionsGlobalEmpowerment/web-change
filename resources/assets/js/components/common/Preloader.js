import {Component} from "react";
import React from "react";

export default class Preloader extends Component {
    state = {
        finished: false,
        progress: 0,
        total: 0,
        resources: []
    };

    calculateTotalSize(files) {
        const total = files.map(f => f.size).reduce((a, v) => a + v);
        this.setState({total});
    }

    preload(file) {
        if (file.type === "image") {
            return this.preloadImage(file);
        } else if (file.type === "audio") {
            return this.preloadAudio(file);
        }
    }

    cache(resource) {
        this.setState(state => {
            const resources = state.resources;
            resources.push(resource);
            return {resources: resources}
        })
    }

    preloadImage(file) {
        const image = new Image();
        image.onload = () => {
            this.setState(state => {
                return {progress: state.progress + file.size};
            });
            if (this.state.progress === this.state.total) {
                this.finish();
            }
        };
        image.src = file.url;
        return image;
    }

    preloadAudio(file) {
        const audio = new Audio(file.url);
        audio.addEventListener('canplaythrough', () => {
            this.setState(state => {
                return {progress: state.progress + file.size};
            });
            if (this.state.progress === this.state.total) {
                this.finish();
            }
        }, false);
        audio.preload = "auto";
        return audio;
    }

    finish() {
        this.setState({finished: true})
    }

    componentDidMount() {
        this.calculateTotalSize(this.props.files);
        this.props.files
            .map(f => this.preload(f))
            .forEach(r => this.cache(r));
    }

    getProgressPercentage() {
        return Math.round(this.state.progress / this.state.total * 100);
    }

    render() {
        if (this.state.finished) {
            const WrappedComponent = this.props.component;
            return <WrappedComponent />
        }
        return <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                 aria-valuenow={this.getProgressPercentage()} aria-valuemin="0" aria-valuemax="100" style={{width: this.getProgressPercentage() + "%"}}/>
        </div>;
    }
}
