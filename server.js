const express = require('express');
const mysql = require('mysql2');
const PORT = process.env.PORT || 3001;
const app = express();
const inputCheck = require('./utils/inputCheck');

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






// Get all candidates
app.get('/api/candidates', (req, res) => {
    const sql = `SELECT candidates.*, parties.name
                AS party_name
                FROM candidates
                LEFT JOIN parties
                ON candidates.party_id = parties.id`;

    db.query(sql, (err, rows) => {
        if(err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows
        });
    });
});



// GET a single candidate
app.get('/api/candidate/:id', (req, res) => {
    const sql = `SELECT candidates.*, parties.name 
                AS party_name 
                FROM candidates 
                LEFT JOIN parties 
                ON candidates.party_id = parties.id 
                WHERE candidates.id = ?`;    
    const params = [req.params.id];

    db.query(sql, params, (err, row) => {
        if (err) {
            res.status(400).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: row
        });
    });
});

// Delete a candidate
app.delete('/api/candidate/:id', (req, res) => {
    const sql = `DELETE FROM candidates WHERE id = ?`;
    const params = [req.params.id];
    db.query(sql, params, (err, result) => {
        if (err) {
            res.statusMessage(400).json({ error: res.message });
        } else if (!result.affectedRows) {
            res.json ({
                message: 'Candidate not found'
            });
        } else {
        res.json({
            message: 'deleted',
            changes: result.affectedRows,
            id: req.params.id
        });
        }
    });
});

// Create a candidate
app.post('/api/candidate', ({ body }, res) => { // why don't we use req.body instead of { body }? Is destructuring required or are they just showing it is possible?
    //validate the user data before the changes are inserted into the database, 
    //to keep the database free of erroneous data and avoid wasting resources on expensive database calls
    const errors = inputCheck(body, 'first_name', 'last_name', 'industry_connected');
    if (errors) {
        res.status(400).json({ error: errors });
        return;
    }
    const sql = `INSERT INTO candidates (first_name, last_name, industry_connected) 
                  VALUES (?,?,?)`;
    const params = [body.first_name, body.last_name, body.industry_connected];
    
    db.query(sql, params, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      }
      res.json({
          message: 'success',
          data: body
      });
    });
});

// Default response for any other request (Not Found) - needs to be the last route so it doesn't override others * catchall
app.use((req, res) => {
    res.status(404).end();
});

// function that will start the Express.js server on port 3001
app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});