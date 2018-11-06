import {isLessonCompleted, normalizePoints, setLessonState} from "../lessons";
import Reading from "../../components/reading/Reading";
import FerrisWheel from "../../components/reading/lessons/FerrisWheel";

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
        this.dispatch('onWordChanged', fn => fn(this.currentWord));

        if (word === null) {
            this.finished();
        }
    }

    success(key) {
        this.toGuess = this.toGuess.filter(value => value !== key);
        this.guessed = this.guessed.concat(key);
        this.failed = [];

        this.renewWord();

        this.dispatch('onSuccess', fn => fn(key));
    }

    fail(key) {
        if (this.isFailed(key) || this.isGuessed(key)) {
            return;
        }

        this.failed = this.failed.concat(key);
        this.failedCount++;

        this.dispatch('onFail', fn => fn(key));
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
        this.renewWord();

        this.dispatch('onStart', fn => fn());
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
