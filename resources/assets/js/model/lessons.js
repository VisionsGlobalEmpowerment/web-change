import axios from "axios";

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
