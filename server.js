const express = require('express');
const db = require('./db/connection');
const apiRoutes = require('./routes/apiRoutes');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
// these two required for any pull requests
app.use(express.urlencoded({ extended: false })); // why is this false this time?
app.use(express.json());


app.use('/api', apiRoutes);

// Default response for any other request (Not Found) - needs to be the last route so it doesn't override others * catchall
app.use((req, res) => {
    res.status(404).end();
});

// Start server after DB connection
db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  });