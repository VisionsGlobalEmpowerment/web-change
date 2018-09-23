import renderer from "react-test-renderer";
import React from "react";
import axios from "axios";
import Reading from "../../components/reading/Reading";
import Home from "../../components/reading/locations/Home";

jest.mock('axios');
jest.mock('../../components/animations', () => ({
    disabled: true,
}));

window.HTMLMediaElement.prototype.play = () => { /* do nothing */ };

function wait(time) {
    return new Promise((fulfilled) => {
        setTimeout (() => fulfilled(), time)
    });
}

test('Reading can be rendered', () => {
    const resp = {data:{availableLocations: ['home', 'map']}};
    axios.get.mockResolvedValue(resp);

    const component = renderer.create(
        <Reading />,
    );
    return Promise
        .resolve(component)
        .then(() => {
            let tree = component.toJSON();
            expect(tree).toMatchSnapshot();
        });
});

test('Student can navigate to home', (done) => {
    const resp = {data:{availableLocations: ['home', 'map']}};
    axios.get.mockResolvedValue(resp);

    const component = mount(<Reading />);

    return Promise
        .resolve(component)
        .then(() => {
            component.update();
            expect(component.state().currentLocation).toEqual('map');
            component.find('.location-entrance-home').simulate('click');
            return wait(100);
        }).then(() => {
            expect(component.state().currentLocation).toEqual('home');
            done();
        });
});

test('Student can open the Ferris Wheel', (done) => {
    axios.get.mockResolvedValueOnce({data:{availableLocations: ['home', 'map', 'fair', 'ferris-wheel']}});
    axios.get.mockResolvedValueOnce({data: []});
    axios.get.mockResolvedValueOnce({data: {}});

    const component = mount(<Reading />);

    return Promise
        .resolve(component)
        .then(() => {
            component.update();
            component.find('.location-entrance-fair').simulate('click');
            return wait(100);
        }).then(() => {
            component.update();
            component.find('.location-entrance-ferris-wheel').simulate('click');
            return wait(100);
        }).then(() => {
            expect(component.state().currentLocation).toEqual('ferris-wheel');
        }).then(() => {
            done();
        });
});


test('Lesson one instruction activity can be finished', () => {
    const resp = {data:{availableLocations: ['home', 'map', 'fair'], finishedActivities: ['lesson-one-instructions']}};
    axios.post.mockResolvedValue(resp);

    const handleProgress = jest.fn();
    const currentProgress = {availableLocations: ['home', 'map']};
    const component = mount(<Home progress={currentProgress} handleProgress={handleProgress}/>);
    component.find('.activity-lesson-one-instructions').simulate('click');

    setImmediate(() => {
        expect(handleProgress.mock.calls.length).toBe(1);
        expect(handleProgress.mock.calls[0][0]).toEqual(resp.data);
    });
});

test('Student can open Chapas', (done) => {
    axios.get.mockResolvedValueOnce({data:{availableLocations: ['home', 'map', 'fair', 'chapas']}});
    axios.get.mockResolvedValueOnce({data: []});
    axios.get.mockResolvedValueOnce({data: {}});

    const component = mount(<Reading />);

    return Promise
        .resolve(component)
        .then(() => {
            component.update();
            component.find('.location-entrance-fair').simulate('click');

            return wait(100);
        }).then(() => {
            component.update();
            component.find('.location-entrance-chapas').simulate('click');

            return wait(100);
        }).then(() => {
            expect(component.state().currentLocation).toEqual('chapas');
        }).then(() => {
            done();
        });
});
