import React, { Component } from 'react';
import axios from 'axios';
import ReactDOM from "react-dom";
import Map from "./locations/Map";
import Fair from "./locations/Fair";
import Home from "./locations/Home";
import FerrisWheel, {assets} from "./lessons/FerrisWheel";
import Chapas from "./lessons/Chapas";
import {backgroundAlign, withBackgroundAudio, withSvgViewport} from "../common/Location";
import Preloader, {withPreloader} from "../common/Preloader";
import {pipe} from "../common";
import Settings from "../common/Settings";
import {Score} from "./lessons/ferris-wheel/Score";

export default class Reading extends Component {
    static course = 'reading';

    state = {
        progress: {},
        route: history.state ? history.state : {location: 'home'},
    };

    locations = {
        'home': pipe(
            withBackgroundAudio('/raw/audio/background/POL-daily-special-short.mp3'),
            withSvgViewport({width: 2520, height: 1080}),
        )(Home),
        'fair': pipe(
            withBackgroundAudio('/raw/audio/background/POL-daily-special-short.mp3'),
            withSvgViewport({align: backgroundAlign.bottomRight}),
        )(Fair),
        'map': pipe(
            withBackgroundAudio('/raw/audio/background/POL-daily-special-short.mp3'),
            withSvgViewport({align: backgroundAlign.center}),
        )(Map),
        'ferris-wheel': pipe(
            withBackgroundAudio('/raw/audio/background/POL-daily-special-short.mp3'),
            withSvgViewport({align: backgroundAlign.center}),
            withPreloader(assets, '/raw/img/feria/feria.png'),
        )(FerrisWheel),
        'chapas': Chapas,
    };

    handleProgress = (progress) => {
        this.setState({ progress });
    }

    handleMove = (locationName) => {
        if (this.isAvailable(locationName)) {
            const route = {location: locationName};
            history.pushState(route, locationName, "/reading")
            this.setState({
                route: route
            });
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
        window.onpopstate = (event) => {
            if (event.state == null) {
                return;
            }

            this.setState({
                route: event.state
            });
        };

        return axios.get(`/courses/reading/progress`)
            .then(res => {
                const progress = res.data;
                this.setState({ progress });
            })
    }

    render() {
        const {
            location = 'home'
        } = this.state.route ? this.state.route : {};

        const LocationComponent = this.locations[location];
        return (
            <div>
                <LocationComponent progress={this.state.progress} handleMove={this.handleMove} handleProgress={this.handleProgress}/>
                <Settings/>
            </div>
        )
    }
}

const files = [
    {url: '/raw/audio/background/POL-daily-special-short.mp3', size: 10, type: "audio"},
    {url: '/raw/audio/effects/NFF-fruit-collected.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/effects/NFF-glitter.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/effects/NFF-robo-elastic.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/effects/NFF-rusted-thing.mp3', size: 1, type: "audio"},
    {url: '/raw/audio/effects/NFF-zing.mp3', size: 1, type: "audio"},

    {url: '/raw/audio/scripts/intro/teacher.mp3', size: 5, type: "audio"},
    {url: '/raw/audio/scripts/intro/vera.mp3', size: 5, type: "audio"},
    {url: '/raw/audio/scripts/intro/syllables.mp3', size: 2, type: "audio"},

    {url: '/raw/img/map/background.png', size: 10, type: "image"},
    {url: '/raw/img/map/casa_01.png', size: 1, type: "image"},
    {url: '/raw/img/map/casa_02.png', size: 1, type: "image"},
    {url: '/raw/img/map/feria_01.png', size: 1, type: "image"},
    {url: '/raw/img/map/feria_02.png', size: 1, type: "image"},
    {url: '/raw/img/map/feria_03.png', size: 1, type: "image"},
    {url: '/raw/img/map/feria_locked.png', size: 1, type: "image"},

    {url: '/raw/img/casa_background.png', size: 10, type: "image"},
    {url: '/raw/img/casa_door.png', size: 1, type: "image"},
    {url: '/raw/img/chat_bubble_big.png', size: 1, type: "image"},
    {url: '/raw/img/teacher.png', size: 1, type: "image"},
    {url: '/raw/img/teacher_two.png', size: 1, type: "image"},
    {url: '/raw/img/vera.png', size: 1, type: "image"},
    {url: '/raw/img/vera/10_sprite_test.png', size: 4, type: 'image'},

    {url: '/raw/img/feria/background.png', size: 10, type: "image"},
    {url: '/raw/img/feria/back.png', size: 1, type: "image"},
    {url: '/raw/img/feria/back_active.png', size: 1, type: "image"},
    {url: '/raw/img/feria/wheel.png', size: 2, type: "image"},

    {url: '/raw/img/ui/back_button_01.png', size: 1, type: "image"},
    {url: '/raw/img/ui/back_button_02.png', size: 1, type: "image"},
    {url: '/raw/img/ui/close_button_01.png', size: 1, type: "image"},
    {url: '/raw/img/ui/close_button_02.png', size: 1, type: "image"},
    {url: '/raw/img/ui/play_button_01.png', size: 1, type: "image"},
    {url: '/raw/img/ui/play_button_02.png', size: 1, type: "image"},
    {url: '/raw/img/ui/reload_button_01.png', size: 1, type: "image"},
    {url: '/raw/img/ui/reload_button_02.png', size: 1, type: "image"},
    {url: '/raw/img/ui/settings_button_01.png', size: 1, type: "image"},
    {url: '/raw/img/ui/settings_button_02.png', size: 1, type: "image"},
    {url: '/raw/img/ui/star_01.png', size: 1, type: "image"},
    {url: '/raw/img/ui/star_02.png', size: 1, type: "image"},
    {url: '/raw/img/ui/star_03.png', size: 1, type: "image"},

    {url: "/raw/img/ferris-wheel/words/broccoli_default.png", size: 1, type: "image"},
    {url: "/raw/img/ferris-wheel/words/crocodile_default.png", size: 1, type: "image"},
    {url: "/raw/img/ferris-wheel/words/orange_default.png", size: 1, type: "image"},
];

if (document.getElementById('reading-course')) {
    ReactDOM.render(<Preloader files={files}><Reading/></Preloader>, document.getElementById('reading-course'));
}
