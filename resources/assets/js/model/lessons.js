import axios from "axios";

const MAX_POINTS = 10;
const COMPLETION_THRESHOLD = 7;

export function getDataset(lesson) {
    return axios.get('/datasets/' + lesson)
        .then(res => res.data);
}

export function getLessonState(course, lesson) {
    return axios.get('/courses/' + course + '/lessons/' + lesson + '/state')
        .catch(error => {
            if (error.response && error.response.status === 404) {
                return {data: {}}
            }
            throw error;
        })
        .then(res => res.data);
}

export function setLessonState(course, lesson, state) {
    return axios.post('/courses/' + course + '/lessons/' + lesson + '/state', state);
}

export function resetLessonState(course, lesson) {
    return axios.post('/courses/' + course + '/lessons/' + lesson + '/state', []);
}

export function normalizePoints(score, max) {
    return {
        score: Math.ceil(score * MAX_POINTS / max),
        max: MAX_POINTS,
    }
}

export function isLessonCompleted(points) {
    return points.score >= COMPLETION_THRESHOLD;
}

export function isProgressLessonCompleted(progress, lesson) {
    const {lessonStates = {}} = progress;

    if (!lessonStates.hasOwnProperty(lesson)) {
        return false;
    }

    return lessonStates[lesson].completed;
}
