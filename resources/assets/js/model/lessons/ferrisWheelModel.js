import {isLessonCompleted, normalizePoints, setLessonState} from "../lessons";
import Reading from "../../components/reading/Reading";
import FerrisWheel from "../../components/reading/lessons/FerrisWheel";

export default class FerrisWheelModel {
    items = [];
    guessed = [];
    failed = [];
    toGuess = [];
    currentWord = null;
    completed = false;

    onInitHandlers = [];
    onSuccessHandlers = [];
    onFailHandlers = [];
    onWordChangedHandlers = [];
    onFinishHandlers = [];

    initItems(items, completed) {
        this.items = items;
        this.completed = completed;

        this.toGuess = items.map(item => item.key);

        this.onInitHandlers.forEach(fn => fn());
    }

    nextWord(toGuess) {
        if (toGuess.length === 0) {
            return null;
        }

        return toGuess[Math.floor(Math.random() * toGuess.length)];
    }

    compareAndFail(word) {
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
        this.onWordChangedHandlers.forEach(fn => fn(this.currentWord));

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

        this.onSuccessHandlers.forEach(fn => fn(key));
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

        this.onFailHandlers.forEach(fn => fn(key));
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

    onInit(handler) {
        this.onInitHandlers.push(handler);
    }

    onWordChanged(handler) {
        this.onWordChangedHandlers.push(handler);
    }

    onFail(handler) {
        this.onFailHandlers.push(handler);
    }

    onSuccess(handler) {
        this.onSuccessHandlers.push(handler);
    }

    onFinish(handler) {
        this.onFinishHandlers.push(handler);
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
        this.onFinishHandlers.forEach(fn => fn());
    }

    isCompleted() {
        return this.completed;
    }
}
