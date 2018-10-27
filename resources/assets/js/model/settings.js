
let registeredComponent;

export const register = (component) => {
    registeredComponent = component;
};

export const openSettings = () => {
    if (registeredComponent) {
        registeredComponent.open();
    }
};
