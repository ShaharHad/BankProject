const app = require('./app');
const logger = require('./utils/Logger');

const dbConnection = require('./db_connection/db_connection');

dbConnection.on('connected', () => {
    const port = process.env.PORT || 10000;
    app.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
    });
});

dbConnection.on('error', (err) => {
    logger.error("DB connection error: ", err);
});


