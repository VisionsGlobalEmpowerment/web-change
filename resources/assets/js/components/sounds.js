import {getAudio} from "../model/cache";

const sounds = {
    "door": '/raw/audio/effects/NFF-fruit-collected.mp3',
    "teacher": '/raw/audio/effects/NFF-zing.mp3',
    "entrance": '/raw/audio/effects/NFF-fruit-collected.mp3',
    "fail": '/raw/audio/effects/NFF-robo-elastic.mp3',
    "success": '/raw/audio/effects/NFF-glitter.mp3',
    "start": '/raw/audio/effects/NFF-fruit-collected.mp3',
    "finish": '/raw/audio/effects/NFF-fruit-collected.mp3',
};

export function play(soundId) {
    const audio = getAudio(sounds[soundId]);
    return audio.play();
}
