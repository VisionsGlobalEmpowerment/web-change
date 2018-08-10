import React from "react";
import FerrisWheel from "../../../components/reading/lessons/FerrisWheel";
import axios from "axios";

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

const items = [{
    key: 'tornado',
    name: 'Tornado',
    color: '#00bcd4',
}, {
    key: 'cocodrilo',
    name: 'Cocodrilo',
    color: '#109cf4',
}, {
    key: 'corona',
    name: 'Corona',
    color: '#703cf4',
}];

jest.mock('axios');

test('Words can be rendered', () => {
    axios.get.mockResolvedValue({data: items});

    const component = mount(<FerrisWheel />);

    return Promise
        .resolve(component)
        .then(() => {
            component.update();

            expect(component.find('.word-tornado')).toHaveLength(1);
            expect(component.find('.word-cocodrilo')).toHaveLength(1);
            expect(component.find('.word-corona')).toHaveLength(1);
        });
});

test('Correct word can be picked', () => {
    axios.get.mockResolvedValue({data: items});

    const component = mount(<FerrisWheel />);

    return Promise
        .resolve(component)
        .then(() => {
            const currentWord = 'tornado';
            currentWordIs(component, currentWord);

            component.find('.word-' + currentWord).simulate('click');
            wordIsGuessed(component, currentWord);
        });
});

test('Incorrect word cannot be picked', () => {
    axios.get.mockResolvedValue({data: items});

    const component = mount(<FerrisWheel />);

    return Promise
        .resolve(component)
        .then(() => {
            const currentWord = 'tornado';
            currentWordIs(component, currentWord);

            const incorrectWord = 'cocodrilo';
            component.find('.word-' + incorrectWord).simulate('click');
            wordIsNotGuessed(component, currentWord);
            wordIsNotGuessed(component, incorrectWord);
        });
});