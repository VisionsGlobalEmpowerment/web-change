import {Component} from "react";
import React from "react";
import Wheel from "./ferris-wheel/Wheel";
import axios from "axios";


export default class FerrisWheel extends Component {
    state = {
        items: [],
        guessed: [],
        toGuess: [],
        currentWord: null,
    };

    initItems(items) {
        const toGuess = items.map(item => item.key);
        const nextWord = this.nextWord(toGuess);
        const state = {
            items: items,
            toGuess: toGuess,
            guessed: [],
            currentWord: nextWord,
        };

        setTimeout(() => {
            this.renewWord(nextWord);
        }, 5000);

        this.setState(state);
    }

    nextWord(toGuess) {
        return toGuess[Math.floor(Math.random() * toGuess.length)];
    }

    renewWord(word) {
        if (this.state.currentWord !== word) {
            return;
        }

        const currentWord = this.nextWord(this.state.toGuess);

        setTimeout(() => {
            this.renewWord(currentWord);
        }, 5000);

        this.setState({currentWord})
    }

    pick(key, guess) {
        if (this.state.currentWord !== key) {
            return;
        }

        guess();

        const toGuess = this.state.toGuess.filter(value => value !== key);
        const nextWord = this.nextWord(toGuess);
        const state = {
            toGuess: toGuess,
            guessed: this.state.guessed.concat(key),
            currentWord: nextWord,
        }

        setTimeout(() => {
            this.renewWord(nextWord);
        }, 5000);

        this.setState(state);
    }

    componentDidMount() {
        return axios.get('/datasets/ferris-wheel')
            .then(res => {
                this.initItems(res.data);
            });
    }

    render() {
        if (this.state.items === undefined || this.state.items.length === 0) {
            return <div />
        }

        return (
            <div className="card">
                <div className="card-header">Ferris wheel ({this.state.currentWord})</div>

                <div className="card-body">
                    <svg viewBox="0 0 512 512" width={600} height={600}>
                        <Wheel items={this.state.items} onClick={this.pick.bind(this)}/>
                    </svg>
                </div>

            </div>
        );
    }
}