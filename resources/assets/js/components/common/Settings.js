import React, {Component} from "react";
import {register} from "../../model/settings";
import {Modal} from "reactstrap";
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
        return <Modal isOpen={this.state.visible} centered={true} className={"modal-full"} contentClassName={"wc-background"}>
            <img src={"/raw/img/ui/close_button_01.png"} style={{position: "absolute", top: "48px", right: "48px"}} onClick={() => this.close()}/>

            <div className={"container h-100"}>
                <div className="row" style={{height: "200px"}}>
                    <div className="col">
                        <div className={"text-center"}>
                            <img src={"/raw/img/ui/settings/settings.png"}/>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className={"float-right"}>
                            <img src={"/raw/img/ui/settings/music_icon.png"}/>
                            <img src={"/raw/img/ui/settings/music.png"} />
                        </div>
                    </div>
                    <div className="col h-100 d-flex align-items-center">
                        <Slider defaultValue={getBackgroundVolume() * 100} onChange={(value) => setBackgroundVolume(value / 100)}
                                trackStyle={{
                                    backgroundColor: '#2c9600',
                                    height: 24,
                                    "border-top-left-radius": "25px",
                                    "border-bottom-left-radius": "25px",
                                }}
                                handleStyle={{
                                    borderColor: '#2c9600',
                                    height: 24,
                                    width: 24,
                                    marginLeft: -12,
                                    marginTop: 0,
                                    backgroundColor: '#2c9600',
                                }}
                                railStyle={{ backgroundColor: '#fff', height: 24, "border-radius": "25px"}}
                                style={{marginTop: "30px", width: "350px"}}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="col">
                        <div className={"float-right"}>
                            <img src={"/raw/img/ui/settings/sound_fx_icon.png"}/>
                            <img src={"/raw/img/ui/settings/sound_fx.png"} />
                        </div>
                    </div>
                    <div className="col h-100 d-flex align-items-center">
                        <Slider defaultValue={getEffectsVolume() * 100} onChange={(value) => setEffectsVolume(value / 100)}
                                trackStyle={{
                                    backgroundColor: '#2c9600',
                                    height: 24,
                                    "border-top-left-radius": "25px",
                                    "border-bottom-left-radius": "25px",
                                }}
                                handleStyle={{
                                    borderColor: '#2c9600',
                                    height: 24,
                                    width: 24,
                                    marginLeft: -12,
                                    marginTop: 0,
                                    backgroundColor: '#2c9600',
                                }}
                                railStyle={{ backgroundColor: '#fff', height: 24, "border-radius": "25px"}}
                                style={{marginTop: "30px", width: "350px"}}
                        />
                    </div>
                </div>
            </div>
        </Modal>
    }
}
