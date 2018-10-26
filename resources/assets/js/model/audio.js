import React from "react";
import {createTaggedKey, getData, hasData, putData} from "./cache";

const AudioContext = window.AudioContext || window.webkitAudioContext;

let audioCtx;
let gainNode;

function init() {
    if (audioCtx === undefined) {
        audioCtx = new AudioContext();
        gainNode = audioCtx.createGain();
        gainNode.connect(audioCtx.destination);
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
    const audioKey = createTaggedKey('audio', key);
    if (!hasData(audioKey)) {
        const data = getData(key);
        if (data === undefined) {
            return new Audio();
        }

        putData(audioKey, new Audio(data));
    }

    return getData(audioKey);
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

const setBackgroundVolume = (value) => {
    gainNode.gain.value = value;
};

const getBackgroundVolume = () => {
    return gainNode.gain.value;
};

export const startBackground = (key, volume) => {
    const audio = getBackgroundAudio(key);
    audio.then(a => {
        setBackgroundVolume(volume);
        a.connect(gainNode)
    });
};

export const pauseBackground = (key) => {
    const audio = getBackgroundAudio(key);
    audio.then(a => a.disconnect(gainNode));
};

export const playSound = (key, volume = 1) => {
    const audio = getAudio(key);
    audio.volume = volume;
    audio.play();
};

export const initSound = (key) => {
    const audio = getAudio(key);

    audio.volume = 0;
    audio.play();
    audio.pause();
    audio.volume = 1;
};
