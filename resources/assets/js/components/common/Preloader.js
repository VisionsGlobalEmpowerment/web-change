import {Component} from "react";
import React from "react";
import axios from "axios";
import {putData} from "../../model/cache";

const statuses = {
    created: 0,
    in_progress: 1,
    initialized: 2,
    finished: 3
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
        axios.get(file.url, { responseType: "blob" })
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
        this.setState({status: statuses.finished})
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
            const WrappedComponent = this.props.component;
            return <WrappedComponent />
        } else if (this.state.status === statuses.initialized) {
            return (
                <div className="card">
                    <div className="card-header">
                        Reading
                    </div>
                    <div className="card-body">
                        <button type="button" className="btn btn-primary" onClick={this.finish.bind(this)}>Start</button>
                    </div>
                </div>
            );
        }
        return <div className="progress">
            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar"
                 aria-valuenow={this.getProgressPercentage()} aria-valuemin="0" aria-valuemax="100" style={{width: this.getProgressPercentage() + "%"}}/>
        </div>;
    }
}
