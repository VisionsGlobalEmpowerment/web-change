import React from "react";
import FerrisWheel from "../../../components/reading/lessons/FerrisWheel";

function currentWordIs(component, word) {
    component.setState({currentWord: word});
    component.update();
}

function wordIsGuessed(component, word) {
    expect(component.state('guessed')).toContain(word);
    expect(component.state('toGuess')).not.toContain(word);
}

test('Words can be rendered', () => {
    const component = mount(<FerrisWheel />);

    expect(component.find('.word-tornado')).toHaveLength(1);
    expect(component.find('.word-cocodrilo')).toHaveLength(1);
    expect(component.find('.word-corona')).toHaveLength(1);
});

test('Correct word can be picked', () => {
    const component = mount(<FerrisWheel />);

    const currentWord = 'tornado';
    currentWordIs(component, currentWord);

    component.find('.word-' + currentWord).simulate('click');
    wordIsGuessed(component, currentWord);
});