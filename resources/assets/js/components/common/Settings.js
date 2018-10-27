import React, {Component} from "react";
import {register} from "../../model/settings";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import Slider from "rc-slider/es/Slider";
import {getBackgroundVolume, getEffectsVolume, setBackgroundVolume, setEffectsVolume} from "../../model/audio";

export default class Settings extends Component {
    state = {
        visible: false,
    };

    componentDidMount() {
        register(this);
    }

    open() {
        this.setState({visible: true});
    }

    close() {
        this.setState({visible: false});
    }

    render() {
        return <Modal isOpen={this.state.visible} centered={true}>
            <ModalHeader toggle={() => this.close()}>Modal title</ModalHeader>
            <ModalBody>
                Music
                <Slider defaultValue={getBackgroundVolume() * 100} onChange={(value) => setBackgroundVolume(value / 100)}/>
                Effects
                <Slider defaultValue={getEffectsVolume() * 100} onChange={(value) => setEffectsVolume(value / 100)}/>
            </ModalBody>
            <ModalFooter>
                <Button color="secondary" onClick={() => this.close()}>Close</Button>
            </ModalFooter>
        </Modal>
    }
}
