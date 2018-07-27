import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from "react-dom";
import Map from "./locations/Map";
import Fair from "./locations/Fair";
import Home from "./locations/Home";

export default class Reading extends Component {
    state = {
        progress: {},
        currentLocation: 'map',
    }

    locations = {
        home: Home,
        fair: Fair,
        map: Map
    }



    handleProgress = (progress) => {
        this.setState({ progress });
    }

    handleMove = (locationName) => {
        if (this.isAvailable(locationName)) {
            this.setState({ currentLocation: locationName });
            return true;
        }

        return false;
    }

    isAvailable = (location) => {
        if (this.state.progress.availableLocations == null) {
            return false;
        }

        return this.state.progress.availableLocations.includes(location);
    }

    componentDidMount() {
        return axios.get(`/courses/reading/progress`)
            .then(res => {
                const progress = res.data;
                this.setState({ progress });
            })
    }

    render() {
        const LocationComponent = this.locations[this.state.currentLocation];
        return (
            <div>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-header">Reading course</div>

                                <div className="card-body">
                                    Current location: {this.state.currentLocation}
                                </div>
                            </div>


                            <LocationComponent progress={this.state.progress} handleMove={this.handleMove} handleProgress={this.handleProgress}/>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

if (document.getElementById('reading-course')) {
    ReactDOM.render(<Reading />, document.getElementById('reading-course'));
}