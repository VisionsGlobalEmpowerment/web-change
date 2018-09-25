import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from "react-dom";
import Map from "./locations/Map";
import Fair from "./locations/Fair";
import Home from "./locations/Home";
import FerrisWheel from "./lessons/FerrisWheel";
import Chapas from "./lessons/Chapas";
import {withBackgroundAudio} from "../common/Location";

export default class Reading extends Component {
    static course = 'reading';

    state = {
        progress: {},
        currentLocation: 'home',
    }

    locations = {
        'home': withBackgroundAudio(Home, '/raw/audio/background/POL-daily-special-short.wav'),
        'fair': withBackgroundAudio(Fair,'/raw/audio/background/POL-daily-special-short.wav'),
        'map': withBackgroundAudio(Map,'/raw/audio/background/POL-daily-special-short.wav'),
        'ferris-wheel': withBackgroundAudio(FerrisWheel,'/raw/audio/background/POL-daily-special-short.wav'),
        'chapas': Chapas,
    };

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
                <LocationComponent progress={this.state.progress} handleMove={this.handleMove} handleProgress={this.handleProgress}/>
            </div>
        )
    }
}

if (document.getElementById('reading-course')) {
    ReactDOM.render(<Reading />, document.getElementById('reading-course'));
}
