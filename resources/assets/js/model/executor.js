import {getAudio} from "./audio";
import {get} from "./identityMap";

export default class Executor {
    constructor(data, audio) {
        this.data = data;
        this.audio = audio;
    }

    playing = {};

    async execute(id) {
        return Promise.all(this.data[id].map(block => this.executeBlock(block)));
    }

    async executeBlock(block) {
        switch (block.type) {
            case 'sequence':
                return this.executeSequence(block.data);
            case 'audio':
                return this.executeAudio(block);
            case 'animation':
                return this.executeAnimation(block);
            case 'state':
                return this.executeState(block);
            case 'empty':
                return this.executeEmpty(block.duration);
        }
    }

    async executeSequence(sequence) {
        if (sequence.length === 0) {
            return Promise.resolve();
        }

        const current = sequence.shift();
        return this.execute(current).then(() => {
            return this.executeSequence(sequence)
        });
    }

    async executeAudio(data) {
        return new Promise(resolve => {
            const audio = getAudio(this.audioUrl(data.id));
            audio.then( a => {
                this.registerPlaying(data.id, a);
                a.onended = () => {
                    resolve();
                    this.unregisterPlaying(data.id)
                };
                a.start(data.offset, data.start, data.duration);
            });
        });
    }

    async executeAnimation(data) {
        const object = get(data.target);
        return object.toAnimation(data.id);
    }

    async executeState(data) {
        const object = get(data.target);
        return object.toState(data.id, data.params);
    }

    async executeEmpty(duration) {
        return new Promise( resolve => {
            setTimeout(() => {resolve();}, duration);
        })
    }

    audioUrl(id) {
        return this.audio[id];
    }

    registerPlaying(key, audio) {
        this.playing[key] = audio;
    }

    unregisterPlaying(key) {
        delete this.playing[key];
    }

    stopPlaying() {
        Object.keys(this.playing).forEach((key) => {
            this.playing[key].stop();
            this.unregisterPlaying(key);
        })
    }
}
