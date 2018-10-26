const cachedData = {};

export const putData = (key, data) => {
    cachedData[key] = data;
};

export const getData = (key) => {
    return cachedData[key];
};

export const hasData = (key) => {
    return cachedData.hasOwnProperty(key);
};

export const createTaggedKey = (key, tag) => {
    return `${tag}_${key}`;
};


