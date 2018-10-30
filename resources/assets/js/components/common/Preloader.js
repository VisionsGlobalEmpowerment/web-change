import {Component} from "react";
import React from "react";
import axios from "axios";
import {putData} from "../../model/cache";
import {initSound} from "../../model/audio";

const statuses = {
    created: 0,
    in_progress: 1,
    initialized: 2,
    finished: 3
};

export const withPreloader = (files, logo) => (WrappedComponent) => {
    return class extends React.Component {
        render() {
            return <Preloader files={files} logo={logo}>
                <WrappedComponent {...this.props}/>
            </Preloader>;
        }
    };
};

export default class Preloader extends Component {
    state = {
        status: statuses.created,
        progress: 0,
        total: 0
    };

    calculateTotalSize(files) {
        const total = files.map(f => f.size).reduce((a, v) => a + v);
        this.setState({total});
    }

    preload(file) {
        axios.get(file.url + '?t=3', { responseType: "blob" })
            .then((response) => {
                return new Promise(resolve => {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                        resolve(reader.result);
                    }
                    reader.readAsDataURL(response.data);
                });
            })
            .then((data) => {
                putData(file.url, data);
                this.setState(state => {
                    return {progress: state.progress + file.size}
                });
            })
            .then(() => {
                if (this.state.progress === this.state.total) {
                    this.initialized();
                }
            })
    }

    initialized() {
        this.setState({status: statuses.initialized})
    }

    finish() {
        this.initAudio();
        this.setState({status: statuses.finished})
    }

    initAudio() {
        this.props.files
            .filter(f => f.type === "audio")
            .forEach(f => initSound(f.url));
    }

    componentDidMount() {
        this.setState({status: statuses.in_progress});
        this.calculateTotalSize(this.props.files);
        this.props.files.forEach(f => this.preload(f));
    }

    getProgressPercentage() {
        return Math.round(this.state.progress / this.state.total * 100);
    }

    render() {
        if (this.state.status === statuses.finished) {
            return this.props.children;
        }

        const initialized = this.state.status === statuses.initialized;

        const {
            logo = '/raw/img/ui/logo.png'
        } = this.props;

        return <div className={"full-height wc-background"}>
            <div>
                <img src={"/raw/img/bg.jpg"} style={{display: "none"}}/>
            </div>

            <div className={"container h-75 d-flex align-items-end justify-content-center"}>
                <div>
                    <div className={"row"}>
                        <div className="col">
                            <div className={"text-center"}>
                                <img src={logo} height={"359"}/>
                            </div>
                        </div>

                    </div>
                    <div className={"row"}>
                        <div className="col d-flex justify-content-center">
                            <div className="progress" style={{height: "24px", width: "460px", margin: "100px"}}>
                                <div className={"progress-bar progress-bar-striped" + (!initialized ? " progress-bar-animated" : "")} role="progressbar"
                                     aria-valuenow={this.getProgressPercentage()} aria-valuemin="0" aria-valuemax="100" style={{width: this.getProgressPercentage() + "%", backgroundColor: "#2c9600"}}/>
                            </div>
                        </div>
                    </div>
                    <div className={"row"} style={{height: "97px"}}>
                        <div className="col d-flex justify-content-center">
                            {initialized && <div className={"btn-play"} onClick={this.finish.bind(this)}/>}
                        </div>
                    </div>
                </div>
            </div>
        </div>;
    }
}
