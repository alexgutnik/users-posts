import winston from "winston";

const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || "info",
    format: winston.format.combine(
        winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        winston.format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.colorize({ all: true }),
        }),
        // new winston.transports.File({
        //     filename: "logs/app.log",
        //     level: "info",
        // }),
        // new winston.transports.File({
        //     filename: "logs/errors.log",
        //     level: "error",
        // }),
    ],
});

export default logger;
