const identityMap = {};

export const register = (key, value) => {
    identityMap[key] = value;
};

export const unregister = (key) => {
    delete identityMap[key];
};

export const get = (key) => {
    return identityMap[key];
};
