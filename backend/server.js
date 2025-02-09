const app = require('./app');
const logger = require('./utils/Logger');
const http = require('http');

const server = http.createServer(app);

const dbConnection = require('./db_connection/db_connection');

dbConnection.on('connected', () => {
    const port = process.env.PORT || 10000;
    server.listen(port, () => {
        logger.info(`Server is running on http://localhost:${port}`);
    });
});

dbConnection.on('error', (err) => {
    logger.error("DB connection error: ", err);
});


