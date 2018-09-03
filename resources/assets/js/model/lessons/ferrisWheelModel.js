import {setLessonState} from "../lessons";
import Reading from "../../components/reading/Reading";
import FerrisWheel from "../../components/reading/lessons/FerrisWheel";

export default class FerrisWheelModel {
    items = [];
    guessed = [];
    failed = [];
    toGuess = [];
    currentWord = null;

    onInitHandlers = [];
    onSuccessHandlers = [];
    onFailHandlers = [];
    onWordChangedHandlers = [];
    onFinishHandlers = [];

    initItems(items, lessonState) {
        this.items = items;

        const {
            toGuess = items.map(item => item.key),
            guessed = [],
            failed = [],
        } = lessonState;

        this.guessed = guessed;
        this.failed = failed;
        this.toGuess = toGuess;

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
            this.onFinishHandlers.forEach(fn => fn());
        }
    }

    success(key) {
        this.toGuess = this.toGuess.filter(value => value !== key);
        this.guessed = this.guessed.concat(key);

        this.renewWord();

        this.updateLessonState();

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

        this.updateLessonState();

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
        setLessonState(Reading.course, FerrisWheel.lesson, {toGuess: this.toGuess, guessed: this.guessed, failed: this.failed});
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
}
