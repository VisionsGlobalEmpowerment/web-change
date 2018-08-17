import {Component} from "react";
import React from "react";
import axios from "axios";
import {animated, Spring, config} from "react-spring";
import {chapasSpringFriction} from "../../animations";

function getCoordinates(index) {
    const coordintaes = [{
        x: 100,
        y: 500,
    }, {
        x: 200,
        y: 400,
    }, {
        x: 300,
        y: 300,
    }, {
        x: 400,
        y: 200,
    }, {
        x: 500,
        y: 100,
    }];

    return coordintaes[index];
}

class ChapasElement extends Component {
    render() {
        const {x, y, data, guessed} = this.props;
        return <g transform={'translate(' + x + ' ' + y + ')'} className={'word-' + data.key}>
            <g>
                <rect width={50} height={50} rx={5} fill={guessed ? '#606060' : data.color}/>
                <text x={0} y={-5}>{data.name}</text>
            </g>

        </g>
    }
}

class ChapasCap extends Component {
    render() {
        const {
            flicked,
            to = {}
        } = this.props.flick;

        if (!flicked) {
            return <circle cx={500} cy={500} r={10} fill={"#383ce5e"} onClick={this.props.onClick} className={'bottle-cap'}/>;
        }

        return <Spring native
                       config={{ tension: 170, friction: chapasSpringFriction, restSpeedThreshold: 1, restDisplacementThreshold: 0.1, overshootClamping: true }}
                       from={{ radius: 10, x: 500, y: 500 }}
                       to={{ radius: 7, x: to.x, y: to.y }}
                       onRest={this.props.onMovementFinish}>
            {({ radius, x, y }) => (
                <animated.circle cx={x} cy={y} r={radius} fill={"#383ce5e"} />
            )}
        </Spring>;
    }
}

export default class Chapas extends Component {
    state = {
        items: [],
        guessed: [],
        toGuess: [],
        flicking: false,
        currentWord: null,
        caps: 0,
        pick: 0,
    };

    initItems(items) {
        items = items.slice(0, 5);
        const toGuess = items.map(item => item.key);
        const nextWord = this.nextWord(toGuess);
        const state = {
            items: items,
            toGuess: toGuess,
            currentWord: nextWord,
        };

        setTimeout(() => {
            this.renewWord(this.state.pick);
        }, 5000);

        this.setState(state);
    }

    nextWord(toGuess) {
        return toGuess[Math.floor(Math.random() * toGuess.length)];
    }

    renewWord(pick) {
        if (this.state.pick !== pick) {
            return;
        }

        if (this.state.flicking) {
            setTimeout(() => {
                this.renewWord(this.state.pick);
            }, 1000);
            return;
        }

        const isCurrentWordGuessed = this.state.caps === this.currentWordSyllables();

        const toGuess =  isCurrentWordGuessed ?
            this.state.toGuess.filter(value => value !== this.state.currentWord) :
            this.state.toGuess;
        const guessed = isCurrentWordGuessed ?
            this.state.guessed.concat(this.state.currentWord) :
            this.state.guessed;

        const nextWord = this.nextWord(toGuess);

        this.setState(state => {
            setTimeout(() => {
                this.renewWord(state.pick + 1);
            }, 5000);

            return {
                toGuess: toGuess,
                guessed: guessed,
                currentWord: nextWord,
                pick: state.pick + 1,
                caps: 0,
            }
        })
    }

    currentWordCoordinates() {
        const currentWordKey = this.state.currentWord;
        return getCoordinates(this.state.items.findIndex(item => item.key === currentWordKey))
    }

    currentWordSyllables() {
        const currentWordKey = this.state.currentWord;
        return this.state.items.find(item => item.key === currentWordKey).syllables;
    }

    flick() {
        if (this.state.flicking) {
            return;
        }

        this.setState({flicking: true});
    }

    onFlickEnd() {
        if (this.state.caps + 1 > this.currentWordSyllables()) {
            this.setState({
                flicking: false,
                caps: 0
            });
        } else {
            this.setState(state => {
                return {
                    flicking: false,
                    caps: state.caps + 1
                }
            });
        }
    }

    isGuessed(key) {
        return this.state.guessed.includes(key);
    }

    componentDidMount() {
        return axios.get('/datasets/chapas')
            .then(res => {
                this.initItems(res.data);
            });
    }

    render() {
        if (this.state.items === undefined || this.state.items.length === 0) {
            return <div />
        }

        const flick = {
            flicked: this.state.flicking,
            to: this.currentWordCoordinates(),
        };

        return (
            <div className="card">
                <div className="card-header">
                    Chapas ({this.state.currentWord} - {this.state.caps})
                    <div className="float-right">
                        <a onClick={() => this.props.handleMove('fair')} href="#">Back</a>
                    </div>
                </div>

                <div className="card-body">
                    <svg viewBox="0 0 600 600">
                        <line x1="0" y1="400" x2="400" y2="0" stroke="black" />
                        <line x1="200" y1="600" x2="600" y2="200" stroke="black" />

                        {this.state.items.map((item, index) => {
                            const coordinates = getCoordinates(index);
                            return <ChapasElement x={coordinates.x} y={coordinates.y}
                                            data={item} key={item.key} guessed={this.isGuessed(item.key)}/>
                        })}

                        <ChapasCap
                            flick={flick}
                            onMovementFinish={this.onFlickEnd.bind(this)}
                            onClick={this.flick.bind(this)}/>
                    </svg>
                </div>

            </div>
        );
    }
}
