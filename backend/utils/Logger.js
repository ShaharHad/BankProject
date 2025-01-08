const { createLogger, format, transports } = require('winston');

const logger = createLogger({
    levels: {
        error: 0,
        warn: 1,
        info: 2,
        http: 3,
        debug: 4,
    },
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // add date to logging
        format.colorize(),
        format.printf(({ level, message, timestamp }) => `${timestamp} [${level}]: ${message}`)
    ),
    transports: [
        new transports.Console()
    ]
});

module.exports = logger;





