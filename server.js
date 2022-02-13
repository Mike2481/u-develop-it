const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
// these two required for any pull requests
app.use(express.urlencoded({ extended: false })); // why is this false this time?
app.use(express.json());
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // Your mySQL username,
        user: 'root',
        // Your MySQL password
        password: 'Blad3Strong77',
        database: 'election'
    },
    console.log('Connected to the election database.')
);







db.query(`SELECT * FROM candidates`, (err, rows) => {
    console.log(rows);
});


// Default response for any other request (Not Found) - needs to be the last route so it doesn't override others * catchall
app.use((req, res) => {
    res.status(404).end();
});

// function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});