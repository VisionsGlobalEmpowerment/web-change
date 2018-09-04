import React from "react";
import FerrisWheel from "../../../components/reading/lessons/FerrisWheel";
import axios from "axios";

function currentWordIs(component, word) {
    component.instance().start();

    component.state('ferrisWheel').setCurrentWord(word);
    component.update();
}

function wordIsGuessed(component, word) {
    expect(component.state('ferrisWheel').isGuessed(word)).toBe(true);
}

function wordIsFailed(component, word) {
    expect(component.state('ferrisWheel').isFailed(word)).toBe(true);
}

function wordIsNotGuessed(component, word) {
    expect(component.state('ferrisWheel').isGuessed(word)).toBe(false);
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

function mockLessonData(items) {
    axios.get.mockResolvedValueOnce({data: items});
    axios.get.mockRejectedValueOnce({response: {status: 404}});
}

function mockLessonDataWithState(items, state) {
    axios.get.mockResolvedValueOnce({data: items});
    axios.get.mockResolvedValueOnce({data: state});
}

test('Words can be rendered', (done) => {
    mockLessonData(items);

    const component = mount(<FerrisWheel />);

    setImmediate(() => {
        component.instance().start();
        component.update();

        expect(component.find('.word-tornado')).toHaveLength(1);
        expect(component.find('.word-cocodrilo')).toHaveLength(1);
        expect(component.find('.word-corona')).toHaveLength(1);
        done();
    })
});

test('Correct word can be picked', (done) => {
    mockLessonData(items);

    const component = mount(<FerrisWheel />);

    setImmediate(() => {
        const currentWord = 'tornado';
        currentWordIs(component, currentWord);

        component.find('.word-' + currentWord).simulate('click');
        wordIsGuessed(component, currentWord);
        done();
    });
});

test('Incorrect word becomes failed', (done) => {
    mockLessonData(items);

    const component = mount(<FerrisWheel />);

    setImmediate(() => {
        const currentWord = 'tornado';
        currentWordIs(component, currentWord);

        const incorrectWord = 'cocodrilo';
        component.find('.word-' + incorrectWord).simulate('click');
        wordIsFailed(component, currentWord);
        wordIsNotGuessed(component, incorrectWord);
        done();
    });
});

test('Saved lesson state can be restored', (done) => {
    mockLessonDataWithState(items, {
        completed: true
    });

    const component = mount(<FerrisWheel />);

    setImmediate(() => {
        expect(component.state('ferrisWheel').isCompleted()).toBe(true);
        done();
    });
});

test('Lesson state is saved on finish', (done) => {
    mockLessonData(items);
    axios.post = jest.fn();

    const component = mount(<FerrisWheel />);

    setImmediate(() => {
        currentWordIs(component, 'tornado');
        component.find('.word-' + 'tornado').simulate('click');

        currentWordIs(component, 'cocodrilo');
        component.find('.word-' + 'cocodrilo').simulate('click');

        currentWordIs(component, 'corona');
        component.find('.word-' + 'corona').simulate('click');

        expect(axios.post.mock.calls.length).toBe(1);
        expect(axios.post.mock.calls[0][1]).toMatchObject({
            completed: true
        });

        done();
    });
});

test('Lesson state is not saved for completed lesson', (done) => {
    mockLessonDataWithState(items, {
        completed: true
    });
    axios.post = jest.fn();

    const component = mount(<FerrisWheel />);

    setImmediate(() => {
        currentWordIs(component, 'tornado');
        component.find('.word-' + 'tornado').simulate('click');

        currentWordIs(component, 'cocodrilo');
        component.find('.word-' + 'cocodrilo').simulate('click');

        currentWordIs(component, 'corona');
        component.find('.word-' + 'corona').simulate('click');

        expect(axios.post.mock.calls.length).toBe(0);

        done();
    });
});

test('Lesson is not completed if only one word is guessed', (done) => {
    mockLessonData(items);
    axios.post = jest.fn();

    const component = mount(<FerrisWheel />);

    setImmediate(() => {
        currentWordIs(component, 'tornado');
        component.find('.word-' + 'corona').simulate('click');

        currentWordIs(component, 'cocodrilo');
        component.find('.word-' + 'corona').simulate('click');

        currentWordIs(component, 'corona');
        component.find('.word-' + 'corona').simulate('click');

        expect(axios.post.mock.calls.length).toBe(1);
        expect(axios.post.mock.calls[0][1]).toMatchObject({
            completed: false
        });

        done();
    });
});
