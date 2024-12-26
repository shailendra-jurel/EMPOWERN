


// utilities/logger.js

export const Logger = {
    info: (message, metadata = {}) => {
        const timestamp = new Date().toISOString();
        console.log(`${timestamp} [INFO]: ${message}`, metadata);
    },

    error: (message, metadata = {}) => {
        const timestamp = new Date().toISOString();
        console.error(`${timestamp} [ERROR]: ${message}`, metadata);
    },

    warn: (message, metadata = {}) => {
        const timestamp = new Date().toISOString();
        console.warn(`${timestamp} [WARN]: ${message}`, metadata);
    },

    debug: (message, metadata = {}) => {
        const timestamp = new Date().toISOString();
        console.debug(`${timestamp} [DEBUG]: ${message}`, metadata);
    }
};

export default Logger;