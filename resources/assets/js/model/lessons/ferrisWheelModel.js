import {isLessonCompleted, normalizePoints, setLessonState} from "../lessons";
import Reading from "../../components/reading/Reading";
import FerrisWheel from "../../components/reading/lessons/FerrisWheel";
import {play} from "../../components/sounds";

export default class FerrisWheelModel {
    items = [];
    guessed = [];
    failed = [];
    toGuess = [];
    currentWord = null;
    completed = false;
    aborted = false;

    handlers = {};

    initItems(items, completed) {
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

    compareAndFail(word) {
        if (this.aborted) {
            return;
        }

        if (this.currentWord !== word || word === null) {
            return;
        }

        this.fail(this.currentWord);
    }

    renewWord() {
        this.setCurrentWord(this.nextWord(this.toGuess));
    }

    setCurrentWord(word) {
        this.currentWord = word;
        this.dispatch('onWordChanged', fn => fn(this.currentWord));

        if (word === null) {
            this.finished();
        }
    }

    success(key) {
        this.toGuess = this.toGuess.filter(value => value !== key);
        this.guessed = this.guessed.concat(key);

        this.renewWord();

        const currentWord = this.currentWord;
        if (currentWord === null) {
            return;
        }

        setTimeout(() => {
            this.compareAndFail(currentWord);
        }, 5000);

        this.dispatch('onSuccess', fn => fn(key));
    }

    fail(key) {
        this.toGuess = this.toGuess.filter(value => value !== key);
        this.failed = this.failed.concat(key);

        this.renewWord();

        const currentWord = this.currentWord;
        if (currentWord === null) {
            return;
        }

        setTimeout(() => {
            this.compareAndFail(currentWord);
        }, 5000);

        this.dispatch('onFail', fn => fn(key));
    }

    pick(key) {
        if (this.currentWord === key) {
            this.success(this.currentWord);
        } else {
            this.fail(this.currentWord);
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
        this.renewWord();

        const currentWord = this.currentWord;
        setTimeout(() => {
            this.compareAndFail(currentWord);
        }, 5000);

        this.dispatch('onStart', fn => fn());
    }

    abort() {
        this.aborted = true;
    }

    getStats() {
        return {
            total: this.toGuess.length + this.guessed.length + this.failed.length,
            toGuess: this.toGuess.length,
            guessed: this.guessed.length,
            failed: this.failed.length,
        };
    }

    getPoints() {
        const stats = this.getStats();

        return normalizePoints(stats.guessed, stats.total);
    }

    finished() {
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
