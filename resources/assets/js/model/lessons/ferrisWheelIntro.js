import {get} from "../identityMap";
import Executor from "../executor";

export default class FerrisWheelIntro {
    data = {
        'syllable-ve': [
            {type: 'audio', name: 'syllable', id: 'syllables', start: 1.383, duration: 0.633, offset: 0.1},
            {type: 'audio', name: 'clap', id: 'syllables', start: 1.383, duration: 0.633, offset: 0.1},
            {type: 'animation', name: 'clap', target: 'senoraVaca', id: 'clap'},
        ],
        'syllable-ra': [
            {type: 'audio', name: 'syllable', id: 'syllables', start: 2.035, duration: 0.388, offset: 0.1},
            {type: 'audio', name: 'clap', id: 'syllables', start: 2.035, duration: 0.388, offset: 0.1},
            {type: 'animation', name: 'clap', target: 'senoraVaca', id: 'clap'},
        ],
        'syllable-u': [
            {type: 'audio', name: 'syllable', id: 'syllables', start: 0.029, duration: 0.7, offset: 0.1},
            {type: 'audio', name: 'clap', id: 'syllables', start: 0.029, duration: 0.7, offset: 0.1},
            {type: 'animation', name: 'clap', target: 'senoraVaca', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'u'}},
        ],
        'syllable-vas': [
            {type: 'audio', name: 'syllable', id: 'syllables', start: 0.744, duration: 0.607, offset: 0.1},
            {type: 'audio', name: 'clap', id: 'syllables', start: 0.744, duration: 0.607, offset: 0.1},
            {type: 'animation', name: 'clap', target: 'senoraVaca', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'vas'}},
        ],
        'syllable-cu': [
            {type: 'audio', name: 'syllable', id: 'syllables', start: 2.507, duration: 0.609, offset: 0.1},
            {type: 'audio', name: 'clap', id: 'syllables', start: 2.507, duration: 0.609, offset: 0.1},
            {type: 'animation', name: 'clap', target: 'senoraVaca', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'cu'}},
        ],
        'syllable-cha': [
            {type: 'audio', name: 'syllable', id: 'syllables', start: 3.178, duration: 0.628, offset: 0.1},
            {type: 'audio', name: 'clap', id: 'syllables', start: 3.178, duration: 0.628, offset: 0.1},
            {type: 'animation', name: 'clap', target: 'senoraVaca', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'cha'}},
        ],
        'syllable-ra2': [
            {type: 'audio', name: 'syllable', id: 'syllables', start: 3.829, duration: 0.362, offset: 0.1},
            {type: 'audio', name: 'clap', id: 'syllables', start: 3.829, duration: 0.362, offset: 0.1},
            {type: 'animation', name: 'clap', target: 'senoraVaca', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'ra'}},
        ],
        'syllable-te': [
            {type: 'audio', name: 'syllable-teacher', id: 'syllables', start: 4.21, duration: 0.646, offset: 0.1},
            {type: 'audio', name: 'clap-teacher', id: 'syllables', start: 4.21, duration: 0.646, offset: 0.1},
            {type: 'animation', name: 'clap-teacher', target: 'senoraVaca', id: 'clap'},

            {type: 'audio', name: 'syllable-vera', id: 'syllables', start: 7.625, duration: 0.552, offset: 0.1},
            {type: 'audio', name: 'clap-vera', id: 'syllables', start: 7.625, duration: 0.552, offset: 0.1},
            {type: 'animation', name: 'clap-vera', target: 'vera', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'te'}},
        ],
        'syllable-ne': [
            {type: 'audio', name: 'syllable-teacher', id: 'syllables', start: 4.878, duration: 0.653, offset: 0.1},
            {type: 'audio', name: 'clap-teacher', id: 'syllables', start: 4.878, duration: 0.653, offset: 0.1},
            {type: 'animation', name: 'clap-teacher', target: 'senoraVaca', id: 'clap'},

            {type: 'audio', name: 'syllable-vera', id: 'syllables', start: 8.211, duration: 0.56, offset: 0.1},
            {type: 'audio', name: 'clap-vera', id: 'syllables', start: 8.211, duration: 0.56, offset: 0.1},
            {type: 'animation', name: 'clap-vera', target: 'vera', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'ne'}},
        ],
        'syllable-dor': [
            {type: 'audio', name: 'syllable-teacher', id: 'syllables', start: 5.54, duration: 0.561, offset: 0.1},
            {type: 'audio', name: 'clap-teacher', id: 'syllables', start: 5.54, duration: 0.561, offset: 0.1},
            {type: 'animation', name: 'clap-teacher', target: 'senoraVaca', id: 'clap'},

            {type: 'audio', name: 'syllable-vera', id: 'syllables', start: 8.798, duration: 0.813, offset: 0.1},
            {type: 'audio', name: 'clap-vera', id: 'syllables', start: 8.798, duration: 0.813, offset: 0.1},
            {type: 'animation', name: 'clap-vera', target: 'vera', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'dor'}},
        ],
        'syllable-dor2': [
            {type: 'audio', name: 'syllable-teacher', id: 'syllables', start: 6.119, duration: 0.615, offset: 0.1},
            {type: 'audio', name: 'clap-teacher', id: 'syllables', start: 6.119, duration: 0.615, offset: 0.1},
            {type: 'animation', name: 'clap-teacher', target: 'senoraVaca', id: 'clap'},

            {type: 'audio', name: 'syllable-vera', id: 'syllables', start: 8.798, duration: 0.813, offset: 0.1},
            {type: 'audio', name: 'clap-vera', id: 'syllables', start: 8.798, duration: 0.813, offset: 0.1},
            {type: 'animation', name: 'clap-vera', target: 'vera', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'dor'}},
        ],
        'syllable-dor3': [
            {type: 'audio', name: 'syllable-teacher', id: 'syllables', start: 6.743, duration: 0.87, offset: 0.1},
            {type: 'audio', name: 'clap-teacher', id: 'syllables', start: 6.743, duration: 0.87, offset: 0.1},
            {type: 'animation', name: 'clap-teacher', target: 'senoraVaca', id: 'clap'},

            {type: 'audio', name: 'syllable-vera', id: 'syllables', start: 8.798, duration: 0.813, offset: 0.1},
            {type: 'audio', name: 'clap-vera', id: 'syllables', start: 8.798, duration: 0.813, offset: 0.1},
            {type: 'animation', name: 'clap-vera', target: 'vera', id: 'clap'},

            {type: 'state', name: 'syllable', target: 'syllable', id: 'show', params: {text: 'dor'}},
        ],
        'show-word-uvas': [
            {type: 'state', target: 'wordImage', id: 'uvas'},
        ],
        'show-word-cuchara': [
            {type: 'state', target: 'wordImage', id: 'cuchara'},
        ],
        'show-word-tenedor': [
            {type: 'state', target: 'wordImage', id: 'tenedor'},
        ],
        'hide-word': [
            {type: 'state', target: 'wordImage', id: 'default'},
        ],
        'hide-syllable': [
            {type: 'state', target: 'syllable', id: 'default'},
        ],
        'empty-1': [
            {type: 'empty', duration: 600},
        ],
        'group-vera': [
            {type: 'sequence', name: 'vera syllables', data:
                    [
                        'syllable-ve', 'syllable-ra', 'empty-1',
                        'syllable-ve', 'syllable-ra', 'empty-1',
                    ]},
        ],
        'group-uvas': [
            {type: 'sequence', name: 'u-vas syllables', data:
                    [
                        'show-word-uvas',
                        'syllable-u', 'syllable-vas', 'empty-1',
                        'syllable-u', 'syllable-vas', 'empty-1',
                        'syllable-u', 'syllable-vas', 'empty-1',
                        'hide-word', 'hide-syllable',
                    ]},
        ],
        'group-cuchara': [
            {type: 'sequence', name: 'u-vas syllables', data:
                    [
                        'show-word-cuchara',
                        'syllable-cu', 'syllable-cha', 'syllable-ra2', 'empty-1',
                        'syllable-cu', 'syllable-cha', 'syllable-ra2', 'empty-1',
                        'syllable-cu', 'syllable-cha', 'syllable-ra2', 'empty-1',
                        'hide-word', 'hide-syllable',
                    ]},
        ],
        'group-tenedor': [
            {type: 'sequence', name: 'u-vas syllables', data:
                    [
                        'show-word-tenedor',
                        'syllable-te', 'syllable-ne', 'syllable-dor', 'empty-1',
                        'syllable-te', 'syllable-ne', 'syllable-dor2', 'empty-1',
                        'syllable-te', 'syllable-ne', 'syllable-dor3', 'empty-1',
                        'hide-word', 'hide-syllable',
                    ]},
        ],
    };

    audio = {
        'teacher': '/raw/audio/scripts/intro/teacher.mp3',
        'vera': '/raw/audio/scripts/intro/vera.mp3',
        'syllables': '/raw/audio/scripts/intro/syllables.mp3',
    };

    init() {
        this.executor = new Executor(this.data, this.audio);
        this.vera = get('vera');
        this.senoraVaca = get('senoraVaca');
    }

    toggle(id, state = 'speaking') {
        if (id === 'vera') {
            this.senoraVaca.toState('default');
            this.vera.toState(state);
        } else if (id === 'teacher') {
            this.senoraVaca.toState(state);
            this.vera.toState('default');
        } else {
            this.senoraVaca.toState('default');
            this.vera.toState('default');
        }
    }

    async play(id, start, duration) {
        return this.executor.executeAudio({
            id: id,
            start: start,
            duration: duration,
            offset: 0
        });
    }

    start() {
        this.init();

        this.toggle('teacher');

        this.play('teacher', 0.749, 2.68)
            .then(() => {
                this.toggle('vera');
                return this.play('vera', 1.1, 4.4232);
            })
            .then(() => {
                this.toggle('teacher');
                return this.play('teacher', 4.453, 6.266);
            })
            .then(() => {
                this.toggle('vera', 'jumping');
                return this.play('vera', 6.365, 1.405);
            })
            .then(() => {
                this.toggle('vera');
                return this.play('vera', 7.871, 2.59);
            })
            .then(() => {
                this.toggle('teacher');
                return this.play('teacher', 11.508, 1.931);
            })
            .then(() => {
                this.toggle('teacher', 'left-hand');
                return this.play('teacher', 13.478, 3.232);
            })
            .then(() => {
                this.toggle('vera');
                return this.play('vera', 11.426, 1.253);
            })
            .then(() => {
                this.toggle('teacher');
                return this.play('teacher', 17.577, 5.084);
            })
            .then(() => {
                this.toggle('teacher');
                this.senoraVaca.toAnimation('prepare-clapping');
                return this.play('teacher', 23.09, 1.86);
            })
            .then(() => {
                return this.executor.execute('group-vera');
            })
            .then(() => {
                //this.toggle('vera');
                return this.play('vera', 14.1, 0.948);
            })
            .then(() => {
                return this.play('teacher', 29.75, 2.2);
            })
            .then(() => {
                return this.executor.execute('group-uvas');
            })
            .then(() => {
                return this.play('teacher', 38.102, 4.739);
            })
            .then(() => {
                return this.executor.execute('group-cuchara');
            })
            .then(() => {
                return this.play('vera', 16.267, 3.809);
            })
            .then(() => {
                return this.play('teacher', 50.809, 1.409);
            })
            .then(() => {
                //this.toggle('teacher');
                this.vera.toAnimation('prepare-clapping');
                return this.executor.execute('group-tenedor');
            })
            .then(() => {
                //this.toggle('vera');
                return this.play('teacher', 61.686, 6.759);
            })
            .then(() => {
                this.toggle('default');
            })
    }
}
