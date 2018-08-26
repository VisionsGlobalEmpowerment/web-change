import {Component} from "react";
import React from "react";
import Wheel from "./ferris-wheel/Wheel";
import {getDataset, getLessonState, resetLessonState, setLessonState} from "../../../model/lessons";
import Reading from "../Reading";


export default class FerrisWheel extends Component {
    static lesson = 'ferris-wheel';

    state = {
        items: [],
        guessed: [],
        toGuess: [],
        currentWord: null,
    };

    initItems(items, lessonState) {
        const {
            toGuess = items.map(item => item.key),
            guessed = []
        } = lessonState;

        const nextWord = this.nextWord(toGuess);
        const state = {
            items: items,
            toGuess: toGuess,
            guessed: guessed,
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
        const guessed = this.state.guessed.concat(key);
        const nextWord = this.nextWord(toGuess);
        const state = {
            toGuess: toGuess,
            guessed: guessed,
            currentWord: nextWord,
        }

        setTimeout(() => {
            this.renewWord(nextWord);
        }, 5000);

        setLessonState(Reading.course, FerrisWheel.lesson, {toGuess: toGuess, guessed: guessed});

        this.setState(state);
    }

    reset() {
        resetLessonState(Reading.course, FerrisWheel.lesson);
        this.props.handleMove('fair');
    }

    async componentDidMount() {
        return this.initItems(
            await getDataset(FerrisWheel.lesson),
            await getLessonState(Reading.course, FerrisWheel.lesson)
        );
    }

    render() {
        if (this.state.items === undefined || this.state.items.length === 0) {
            return <div />
        }

        return (
            <div className="card">
                <div className="card-header">
                    Ferris wheel ({this.state.currentWord})
                    <div className="float-right">
                        <a onClick={() => this.props.handleMove('fair')} href="#">Back</a>
                        &nbsp;
                        <a onClick={() => this.reset()} href="#">Reset</a>
                    </div>
                </div>

                <div className="card-body">
                    <svg viewBox="0 0 512 512" width={600} height={600}>
                        <Wheel items={this.state.items} guessed={this.state.guessed} onClick={this.pick.bind(this)}/>
                    </svg>
                </div>

            </div>
        );
    }
}
