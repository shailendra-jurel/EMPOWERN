// // utilities/logger.js
// import winston from 'winston';  // what is this -> winston 
// import path from 'path';

// // Create logs directory if it doesn't exist
// const logDir = path.join(import.meta.cwd(), 'logs');

// // Custom log format
// const logFormat = winston.format.combine(
// winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
// winston.format.printf(({ timestamp, level, message, ...metadata }) => {
// let msg = `${timestamp} [${level}]: ${message} `;
// const metadataStr = Object.keys(metadata).length 
//     ? JSON.stringify(metadata) 
//     : '';
// return msg + metadataStr;
// })
// );

// // Create a Winston logger
// const logger = winston.createLogger({
// level: import.meta.env.NODE_ENV === 'production' ? 'info' : 'debug',
// format: logFormat,
// transports: [
// // Console transport
// new winston.transports.Console({
//     format: winston.format.combine(
//     winston.format.colorize(),
//     logFormat
//     )
// }),

// // File transport for error logs
// new winston.transports.File({
//     filename: path.join(logDir, 'error.log'),
//     level: 'error',
//     maxsize: 5242880, // 5MB
//     maxFiles: 5
// }),

// // File transport for combined logs
// new winston.transports.File({
//     filename: path.join(logDir, 'combined.log'),
//     maxsize: 5242880, // 5MB
//     maxFiles: 5
// })
// ]
// });

// // Logger methods
// export const Logger = {
// info: (message, metadata = {}) => {
// logger.info(message, metadata);
// },

// error: (message, metadata = {}) => {
// logger.error(message, metadata);
// },

// warn: (message, metadata = {}) => {
// logger.warn(message, metadata);
// },

// debug: (message, metadata = {}) => {
// logger.debug(message, metadata);
// }
// };

// export default logger;    not workable because browser for node specific


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