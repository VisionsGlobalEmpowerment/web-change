import React from "react";
import Chapas from "../../../components/reading/lessons/Chapas";
import axios from "axios";
import FerrisWheel from "../../../components/reading/lessons/FerrisWheel";

function currentWordIs(component, word) {
    component.setState({currentWord: word});
    component.update();
}

function wordIsGuessed(component, word) {
    expect(component.state('guessed')).toContain(word);
    expect(component.state('toGuess')).not.toContain(word);
}

function wordIsNotGuessed(component, word) {
    expect(component.state('guessed')).not.toContain(word);
    expect(component.state('toGuess')).toContain(word);
}

function renewWord(component) {
    component.instance().renewWord(component.state('pick'));
}

const items = [{
    "key": 'mapa',
    "name": 'Mapa',
    "color":  '#00bcd4',
    "syllables": 2,
}, {
    "key": 'jabon',
    "name": 'Jabón',
    "color": '#109cf4',
    "syllables": 2,
}, {
    "key": 'turquia',
    "name": 'Turquía',
    "color": '#703cf4',
    "syllables": 3,
}];

jest.mock('axios');
jest.mock('../../../components/animations', () => ({
    chapasSpringFriction: 0,
}));

function mockLessonData(items) {
    axios.get.mockResolvedValueOnce({data: items});
    axios.get.mockRejectedValueOnce({response: {status: 404}});
}

function mockLessonDataWithState(items, state) {
    axios.get.mockResolvedValueOnce({data: items});
    axios.get.mockResolvedValueOnce({data: state});
}

function wait(time) {
    return new Promise((fulfilled) => {
        setTimeout (() => fulfilled(), time)
    });
}

test('Words can be rendered', (done) => {
    mockLessonData(items);

    const component = mount(<Chapas />);

    setImmediate(() => {
        component.update();

        expect(component.find('.word-mapa')).toHaveLength(1);
        expect(component.find('.word-jabon')).toHaveLength(1);
        expect(component.find('.word-turquia')).toHaveLength(1);

        done();
    });
});


test('Correct number of flicks moves word to guessed', (done) => {
    mockLessonData(items);

    const component = mount(<Chapas />);
    const currentWord = 'mapa';

    return new Promise((resolve) => {
            setImmediate(() => {
                resolve(component);
            })
        })
        .then(() => {
            currentWordIs(component, currentWord);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            renewWord(component);
            wordIsGuessed(component, currentWord);
        })
        .then(() => done());
});


test('Lesser number of flicks does not move word to guessed', () => {
    mockLessonData(items);

    const component = mount(<Chapas />);
    const currentWord = 'mapa';

    return new Promise((resolve) => {
            setImmediate(() => {
                resolve(component);
            })
        })
        .then(() => {
            currentWordIs(component, currentWord);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            renewWord(component);
            wordIsNotGuessed(component, currentWord);
        });
});

test('Bigger number of flicks does not move word to guessed', () => {
    mockLessonData(items);

    const component = mount(<Chapas />);
    const currentWord = 'mapa';

    return new Promise((resolve) => {
            setImmediate(() => {
                resolve(component);
            })
        })
        .then(() => {
            currentWordIs(component, currentWord);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            renewWord(component);
            wordIsNotGuessed(component, currentWord);
        });
});

test('Saved lesson state can be restored', (done) => {
    mockLessonDataWithState(items, {
        toGuess: ['mapa', 'jabon'],
        guessed: ['turquia']
    });

    const component = mount(<Chapas />);

    setImmediate(() => {
        wordIsGuessed(component, 'turquia');
        done();
    });
});

test('Lesson state is saved on guess', (done) => {
    mockLessonData(items);
    axios.post = jest.fn();

    const component = mount(<Chapas />);
    const currentWord = 'mapa';

    return new Promise((resolve) => {
            setImmediate(() => {
                resolve(component);
            })
        })
        .then(() => {
            currentWordIs(component, currentWord);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            component.update();
            component.find('.bottle-cap').simulate('click');
            return wait(100);
        })
        .then(() => {
            renewWord(component);

            expect(axios.post.mock.calls.length).toBe(1);
            expect(axios.post.mock.calls[0][1]).toMatchObject({
                guessed: [currentWord]
            });
        })
        .then(() => done());
});
