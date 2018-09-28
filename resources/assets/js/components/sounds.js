const sounds = {
    "door": '/raw/audio/effects/NFF-fruit-collected.wav',
    "teacher": '/raw/audio/effects/NFF-zing.wav',
    "entrance": '/raw/audio/effects/NFF-fruit-collected.wav',
    "fail": '/raw/audio/effects/NFF-robo-elastic.wav',
    "success": '/raw/audio/effects/NFF-glitter.wav',
    "start": '/raw/audio/effects/NFF-fruit-collected.wav',
    "finish": '/raw/audio/effects/NFF-fruit-collected.wav',
};

export function play(soundId) {
    const audio = new Audio(sounds[soundId]);
    return audio.play();
}
