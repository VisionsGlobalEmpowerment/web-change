import React from "react";
import FerrisWheel from "../../../components/reading/lessons/FerrisWheel";
import axios from "axios";
import Wheel from "../../../components/reading/lessons/ferris-wheel/Wheel";

function currentWordIs(component, word) {
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

const viewBox = {
    x: 0,
    y: 0,
    width: 1920,
    height: 1080,
};

const viewPort = {
    width: 1920,
    height: 1080,
};

jest.mock('axios');
jest.mock('../../../model/audio', () => ({
    getAudio: () => Promise.resolve({start: jest.fn(), stop: jest.fn()}),
}));

function mockLessonData(items) {
    axios.get.mockResolvedValueOnce({data: items});
    axios.get.mockRejectedValueOnce({response: {status: 404}});
}

function mockLessonDataWithState(items, state) {
    axios.get.mockResolvedValueOnce({data: items});
    axios.get.mockResolvedValueOnce({data: state});
}

function shallowToElements(component) {
    const wheel = component.find(Wheel).shallow();

    return wheel.at(0).shallow() //Container
        .at(0).shallow() //Keyframes
        .at(0).shallow(); //Spring
}

function clickOn(component, word) {
    const container = shallowToElements(component);

    const element = container
        .findWhere(e => e.name() === 'Element' && e.prop('data').key === word)
        .shallow();

    element.simulate('click');
}

test('Words can be rendered', (done) => {
    mockLessonData(items);

    const component = shallow(<FerrisWheel viewBox={viewBox} viewPort={viewPort}/>);

    setImmediate(() => {
        const container = shallowToElements(component);

        expect(container.find('Element')).toHaveLength(3);
        done();
    })
});

test('Correct word can be picked', (done) => {
    mockLessonData(items);

    const component = shallow(<FerrisWheel viewBox={viewBox} viewPort={viewPort}/>);

    setImmediate(() => {
        const currentWord = 'tornado';
        currentWordIs(component, currentWord);

        clickOn(component, currentWord);

        wordIsGuessed(component, currentWord);
        done();
    });
});

test('Incorrect word becomes failed', (done) => {
    mockLessonData(items);

    const component = shallow(<FerrisWheel viewBox={viewBox} viewPort={viewPort}/>);

    setImmediate(() => {
        const currentWord = 'tornado';
        currentWordIs(component, currentWord);

        const incorrectWord = 'cocodrilo';
        clickOn(component, incorrectWord);

        wordIsFailed(component, incorrectWord);
        wordIsNotGuessed(component, currentWord);
        done();
    });
});

test('Saved lesson state can be restored', (done) => {
    mockLessonDataWithState(items, {
        completed: true
    });

    const component = shallow(<FerrisWheel viewBox={viewBox} viewPort={viewPort}/>);

    setImmediate(() => {
        expect(component.state('ferrisWheel').isCompleted()).toBe(true);
        done();
    });
});

test('Lesson state is saved on finish', (done) => {
    mockLessonData(items);
    axios.post = jest.fn();

    const component = shallow(<FerrisWheel viewBox={viewBox} viewPort={viewPort}/>);

    setImmediate(() => {
        currentWordIs(component, 'tornado');
        clickOn(component, 'tornado');

        currentWordIs(component, 'cocodrilo');
        clickOn(component, 'cocodrilo');

        currentWordIs(component, 'corona');
        clickOn(component, 'corona');

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

    const component = shallow(<FerrisWheel viewBox={viewBox} viewPort={viewPort}/>);

    setImmediate(() => {
        currentWordIs(component, 'tornado');
        clickOn(component, 'tornado');

        currentWordIs(component, 'cocodrilo');
        clickOn(component, 'cocodrilo');

        currentWordIs(component, 'corona');
        clickOn(component, 'corona');

        expect(axios.post.mock.calls.length).toBe(0);

        done();
    });
});

test('Lesson is not completed if there were too many fails', (done) => {
    mockLessonData(items);
    axios.post = jest.fn();

    const component = shallow(<FerrisWheel viewBox={viewBox} viewPort={viewPort}/>);

    setImmediate(() => {
        currentWordIs(component, 'tornado');
        clickOn(component, 'corona');
        clickOn(component, 'cocodrilo');
        clickOn(component, 'tornado');

        currentWordIs(component, 'cocodrilo');
        clickOn(component, 'corona');
        clickOn(component, 'cocodrilo');

        currentWordIs(component, 'corona');
        clickOn(component, 'corona');

        expect(axios.post.mock.calls.length).toBe(1);
        expect(axios.post.mock.calls[0][1]).toMatchObject({
            completed: false
        });

        done();
    });
});
