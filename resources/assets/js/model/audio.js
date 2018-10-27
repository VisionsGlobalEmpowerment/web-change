import React from "react";
import {createTaggedKey, getData, hasData, putData} from "./cache";

const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioCtx;
let musicGain;
let effectsGain;

function init() {
    if (audioCtx === undefined) {
        audioCtx = new AudioContext();
        musicGain = audioCtx.createGain();
        musicGain.connect(audioCtx.destination);

        effectsGain = audioCtx.createGain();
        effectsGain.connect(audioCtx.destination);
    }
}

function dataToArrayBuffer(data) {
    const binaryString =  window.atob(data.split(',')[1]);
    const len = binaryString.length;
    const bytes = new Uint8Array( len );
    for (let i = 0; i < len; i++)        {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

const getAudio = (key) => {
    init();
    const bufferKey = createTaggedKey('audioBuffer', key);
    if (!hasData(bufferKey)) {
        const data = getData(key);
        const result = new Promise(resolve => {
            audioCtx.decodeAudioData(dataToArrayBuffer(data), (soundBuffer) => {
                resolve(soundBuffer);
            });
        });
        putData(bufferKey, result);
    }

    return getData(bufferKey)
        .then(buffer => {
            const soundSource = audioCtx.createBufferSource();
            soundSource.buffer = buffer;
            soundSource.connect(effectsGain);
            return soundSource;
        });
};

const getBackgroundAudio = (key) => {
    init();
    const audioKey = createTaggedKey('backgroundAudio', key);
    if (!hasData(audioKey)) {
        const soundSource = audioCtx.createBufferSource();

        const data = getData(key);
        const result =  new Promise(resolve => {
            audioCtx.decodeAudioData(dataToArrayBuffer(data), (soundBuffer) => {

                soundSource.buffer = soundBuffer;
                soundSource.loop = true;

                soundSource.start();

                resolve(soundSource);
            });
        });
        putData(audioKey, result);
        return result;
    }

    return getData(audioKey);
};

export const setBackgroundVolume = (value) => {
    if (musicGain) {
        musicGain.gain.value = value;
    }
};

export const getBackgroundVolume = () => {
    if (!musicGain) {
        return 0;
    }
    return musicGain.gain.value;
};

export const setEffectsVolume = (value) => {
    if (effectsGain) {
        effectsGain.gain.value = value;
    }
};

export const getEffectsVolume = () => {
    if (!effectsGain) {
        return 0;
    }
    return effectsGain.gain.value;
};

export const startBackground = (key) => {
    const audio = getBackgroundAudio(key);
    audio.then(a => {
        a.connect(musicGain)
    });
};

export const pauseBackground = (key) => {
    const audio = getBackgroundAudio(key);
    audio.then(a => a.disconnect(musicGain));
};

export const playSound = (key) => {
    const audio = getAudio(key);
    audio.then(a => a.start());
};

export const initSound = (key) => {
    /*const audio = getAudio(key);

    audio.volume = 0;
    audio.play();
    audio.pause();
    audio.volume = 1;*/
};
