const cachedData = {};
const cachedAudio = {};
const cachedBackgroundAudio = {};

export const putData = (key, data) => {
    cachedData[key] = data;
};

export const getData = (key) => {
    return cachedData[key];
};

export const getAudio = (key) => {
    if (!cachedAudio.hasOwnProperty(key)) {
        const data = getData(key);
        if (data === undefined) {
            return new Audio();
        }

        cachedAudio[key] = new Audio(data);
    }

    return cachedAudio[key];
};

export const getBackgroundAudio = (key) => {
    if (!cachedBackgroundAudio.hasOwnProperty(key)) {
        const data = getData(key);
        const audio = new Audio(data);
        audio.addEventListener('timeupdate', () => {
            const buffer = .24;
            if (audio.currentTime > audio.duration - buffer) {
                audio.currentTime = 0;
                audio.play();
            }}, false);
        audio.volume = 0.5;
        cachedBackgroundAudio[key] = audio;
    }

    return cachedBackgroundAudio[key];
};
