const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
// these two required for any pull requests
app.use(express.urlencoded({ extended: false })); // why is this false this time?
app.use(express.json());










// Default response for any other request (Not Found) - needs to be the last route so it doesn't override others
app.use((req, res) => {
    res.status(404).end();
});

// function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});