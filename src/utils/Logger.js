const chalk = require('chalk');
const winston = require('winston');
const { resolve } = require('path');
const Logs = require('../models/Logs');

const errorColor = chalk.red.bold;
const warningColor = chalk.yellow.bold;
const successColor = chalk.green.bold;
const infoColor = chalk.white;

const logFolderPath = process.env.LOG_FOLDER_PATH ?? "./logs";
const maxLogSize = parseInt(process.env.LOG_FILE_MAX_SIZE ?? "10485760");

const customLevels = {
    error: 0,
    warning: 1,
    info: 2,
    success: 3,
};
const timestampFormat = winston.format.timestamp({
    format: "DD-MMM-YYYY HH:mm:ss.SSS",
});

const simpleOutputFormat = winston.format.printf((log) => {
    return `${log.timestamp}\t${log.level}: ${log.message}`;
});

const coloredOutputFormat = winston.format.printf((log) => {
    let color = infoColor;

    switch (log.level) {
        case "error":
            color = errorColor;
            break;
        case "warning":
            color = warningColor;
            break;
        case "success":
            color = successColor;
            break;
    }

    return `${log.timestamp}\t${color(log.message)}`;
});

const fileFormat = winston.format.combine(timestampFormat, simpleOutputFormat);

const consoleFormat = winston.format.combine(timestampFormat, coloredOutputFormat);

const logger = winston.createLogger({
    levels: customLevels,
    transports: [
        new winston.transports.File({
            level: "error",
            filename: resolve(logFolderPath, "error.log"),
            maxsize: maxLogSize,
            format: fileFormat,
        }),
        new winston.transports.File({
            level: "success",
            filename: resolve(logFolderPath, "combined.log"),
            maxsize: maxLogSize,
            format: fileFormat,
        }),
        new winston.transports.Console({
            level: "success",
            format: consoleFormat,
        }),
    ],
    exceptionHandlers: [
        new winston.transports.File({
            filename: resolve(logFolderPath, "exceptions.log"),
            format: fileFormat,
        }),
    ],
});

const logToDb = async (
    event,
    message,
    uid
) => {
    logger.info(`${event}\t${uid}\t${JSON.stringify(message)}`);
    try {
        await Logs.create({
            timestamp: Date.now(),
            uid: uid ?? "",
            event,
            message,
        })
    } catch (error) {
        logger.error(`Could not log to db: ${error.message}`);

    }
};

const Logger = {
    error: (message) => logger.error(message),
    warning: (message) => logger.warning(message),
    info: (message) => logger.info(message),
    success: (message) => logger.log("success", message),
    logToDb,
};

module.exports = Logger;
