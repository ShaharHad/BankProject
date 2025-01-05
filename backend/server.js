
const app = require('./app');

const dbConnection = require('./db_connection/db_connection');

dbConnection.on('connected', () => {
    const port = process.env.PORT || 10000;
    app.listen(port, () => {
        console.log(`Server is running on http://localhost:${port}`);
    });
});

dbConnection.on('error', (err) => {
    console.error("DB connection error: ", err);
});


