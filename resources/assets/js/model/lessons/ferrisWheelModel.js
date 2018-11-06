import {isLessonCompleted, normalizePoints, setLessonState} from "../lessons";
import Reading from "../../components/reading/Reading";
import FerrisWheel from "../../components/reading/lessons/FerrisWheel";
import Executor from "../executor";

const repeatTime = 5000;

export default class FerrisWheelModel {
    items = [];
    guessed = [];
    failed = [];
    toGuess = [];
    currentWord = null;
    completed = false;
    aborted = false;
    failedCount = 0;

    handlers = {};

    data = {
        'start-fx': [
            {type: 'audio', id: 'start'},
        ],
        'instructions': [
            {type: 'audio', name: 'instruction', id: 'instructions', start: 0.743, duration: 6.117},
        ],
        'word-tornado': [
            {type: 'audio', name: 'tornado', id: 'instructions', start: 8.083, duration: 2.141},
        ],
        'word-cocodrilo': [
            {type: 'audio', name: 'cocodrilo', id: 'instructions', start: 11.328, duration: 2.66},
        ],
        'word-crocodile': [
            {type: 'audio', name: 'cocodrilo', id: 'instructions', start: 11.328, duration: 2.66},
        ],
        'word-corona': [
            {type: 'audio', name: 'corona', id: 'instructions', start: 15.042, duration: 2.092},
        ],
        'word-incendio': [
            {type: 'audio', name: 'incendio', id: 'instructions', start: 18.056, duration: 2.185},
        ],
        //'word-brocoli': [
        'word-broccoli': [
            {type: 'audio', name: 'brocoli', id: 'instructions', start: 21.235, duration: 2.032},
        ],
        'word-tiburon': [
            {type: 'audio', name: 'tiburon', id: 'instructions', start: 24.103, duration: 2.075},
        ],
        'word-sonrisa': [
            {type: 'audio', name: 'sonrisa', id: 'instructions', start: 27.052, duration: 2.097},
        ],
        'word-gemelas': [
            {type: 'audio', name: 'gemelas', id: 'instructions', start: 30.007, duration: 2.327},
        ],
        //'word-ballena': [
        'word-whale': [
            {type: 'audio', name: 'ballena', id: 'instructions', start: 32.891, duration: 2.043},
        ],
        'word-vibora': [
            {type: 'audio', name: 'vibora', id: 'instructions', start: 35.818, duration: 2.075},
        ],
        'word-abrazando': [
            {type: 'audio', name: 'abrazando', id: 'instructions', start: 38.456, duration: 2.622},
        ],
        'word-hormiga': [
            {type: 'audio', name: 'hormiga', id: 'instructions', start: 42.077, duration: 2.163},
        ],
        //'word-murcielago': [
        'word-bat': [
            {type: 'audio', name: 'murcielago', id: 'instructions', start: 45.119, duration: 3.184},
        ],
        //'word-dinosaurio': [
        'word-dinosaur': [
            {type: 'audio', name: 'dinosaurio', id: 'instructions', start: 49.068, duration: 3.217},
        ],
        'word-flamenco': [
            {type: 'audio', name: 'flamenco', id: 'instructions', start: 53.47, duration: 2.25},
        ],
        'word-hipopotamo': [
            {type: 'audio', name: 'hipopotamo', id: 'instructions', start: 56.523, duration: 3.55},
        ],
        'word-canguro': [
            {type: 'audio', name: 'canguro', id: 'instructions', start: 61.773, duration: 2.037},
        ],
        'word-papalote': [
            {type: 'audio', name: 'papalote', id: 'instructions', start: 63.706, duration: 2.638},
        ],
        'word-mariquita': [
            {type: 'audio', name: 'mariquita', id: 'instructions', start: 67.212, duration: 2.785},
        ],
        //'word-naranja': [
        'word-orange': [
            {type: 'audio', name: 'naranja', id: 'instructions', start: 70.751, duration: 2.19},
        ],
        'word-calabaza': [
            {type: 'audio', name: 'calabaza', id: 'instructions', start: 73.684, duration: 2.627},
        ],
    };

    audio = {
        'instructions': '/raw/audio/ferris-wheel/instructions.mp3',
        "fail": '/raw/audio/effects/NFF-robo-elastic.mp3',
        "success": '/raw/audio/effects/NFF-glitter.mp3',
        "start": '/raw/audio/effects/NFF-fruit-collected.mp3',
        "finish": '/raw/audio/effects/NFF-fruit-collected.mp3',
    };

    initItems(items, completed) {
        this.executor = new Executor(this.data, this.audio);

        this.items = items;
        this.completed = completed;

        this.toGuess = items.map(item => item.key);

        this.dispatch('onInit', fn => fn());
    }

    nextWord(toGuess) {
        if (toGuess.length === 0) {
            return null;
        }

        return toGuess[Math.floor(Math.random() * toGuess.length)];
    }

    compareAndRepeat(word) {
        if (this.aborted) {
            return;
        }

        if (this.currentWord !== word || word === null) {
            return;
        }

        const currentWord = this.currentWord;
        this.setCurrentWord(currentWord);

        setTimeout(() => {
            this.compareAndRepeat(currentWord);
        }, repeatTime);

    }

    renewWord() {
        const currentWord = this.nextWord(this.toGuess);
        this.setCurrentWord(currentWord);

        setTimeout(() => {
            this.compareAndRepeat(currentWord);
        }, repeatTime);
    }

    setCurrentWord(word) {
        this.currentWord = word;

        if (word === null) {
            this.finished();
            return;
        }

        this.executor.stopPlaying();
        this.executor.execute(`word-${word}`);
        this.dispatch('onWordChanged', fn => fn(this.currentWord));
    }

    success(key) {
        this.toGuess = this.toGuess.filter(value => value !== key);
        this.guessed = this.guessed.concat(key);
        this.failed = [];

        this.renewWord();

        this.dispatch('onSuccess', fn => fn(key));
        this.executor.executeAudio({id: 'success'});
    }

    fail(key) {
        if (this.isFailed(key) || this.isGuessed(key)) {
            return;
        }

        this.failed = this.failed.concat(key);
        this.failedCount++;

        this.dispatch('onFail', fn => fn(key));
        this.executor.executeAudio({id: 'fail'});
    }

    pick(key) {
        if (this.currentWord === key) {
            this.success(key);
        } else {
            this.fail(key);
        }
    }

    updateLessonState() {
        if (this.completed) {
            return;
        }

        const stats = this.getStats();
        const points = this.getPoints();
        const completed = isLessonCompleted(points);

        setLessonState(Reading.course, FerrisWheel.lesson, {stats: stats, points: points, completed: completed});
    }

    isGuessed(key) {
        return this.guessed.includes(key);
    }

    isFailed(key) {
        return this.failed.includes(key);
    }

    getItems() {
        return this.items;
    }

    start() {
        this.executor.executeSequence(['start-fx', 'instructions'])
            .then(() => {
                this.renewWord();

                this.dispatch('onStart', fn => fn());
            });
    }

    abort() {
        this.aborted = true;
    }

    getStats() {
        return {
            total: this.items.length,
            toGuess: this.toGuess.length,
            guessed: this.guessed.length,
            failed: this.failedCount,
        };
    }

    getPoints() {
        const stats = this.getStats();
        const score = stats.guessed - stats.failed;

        return normalizePoints(score, stats.total);
    }

    finished() {
        this.executor.executeAudio({id: 'finish'});
        this.updateLessonState();
        this.dispatch('onFinish', fn => fn());
    }

    isCompleted() {
        return this.completed;
    }

    register(handlerName, handler) {
        if (!this.handlers.hasOwnProperty(handlerName)) {
            this.handlers[handlerName] = [];
        }

        this.handlers[handlerName].push(handler);
    }

    dispatch(handlerName, callback) {
        if (this.handlers.hasOwnProperty(handlerName)) {
            this.handlers[handlerName].forEach(callback);
        }
    }
}
