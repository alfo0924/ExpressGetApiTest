const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Routes
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// SQLite Database
const db = new sqlite3.Database('db/sqlite.db', (err) => {
    if (err) {
        console.error('Error connecting to SQLite database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');

        db.run(`CREATE TABLE IF NOT EXISTS movie_quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            provider TEXT NOT NULL,
            movie_name TEXT NOT NULL,
            quote TEXT NOT NULL,
            vote_count INTEGER DEFAULT 0
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            }
        });
    }
});

// API Routes
const apiRouter = express.Router();

apiRouter.get('/quotes', (req, res) => {
    const sql = 'SELECT * FROM movie_quotes';
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Error retrieving quotes:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

apiRouter.get('/', (req, res) => {
    const provider = req.query.provider;
    const sql = 'SELECT * FROM movie_quotes WHERE provider = ?';
    db.all(sql, [provider], (err, rows) => {
        if (err) {
            console.error('Error retrieving quotes by provider:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

apiRouter.post('/', (req, res) => {
    const provider = req.body.provider;
    const sql = 'SELECT * FROM movie_quotes WHERE provider = ?';
    db.all(sql, [provider], (err, rows) => {
        if (err) {
            console.error('Error retrieving quotes by provider:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.json(rows);
        }
    });
});

apiRouter.get('/insert', (req, res) => {
    const { provider, movie_name, quote } = req.query;
    const sql = 'INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)';
    db.run(sql, [provider, movie_name, quote], (err) => {
        if (err) {
            console.error('Error inserting quote:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Insert success');
        }
    });
});

apiRouter.post('/insert', (req, res) => {
    const { provider, movie_name, quote } = req.body;
    const sql = 'INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)';
    db.run(sql, [provider, movie_name, quote], (err) => {
        if (err) {
            console.error('Error inserting quote:', err.message);
            res.status(500).send('Internal Server Error');
        } else {
            res.send('Insert success');
        }
    });
});

app.use('/api', apiRouter);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});


app.get('/api/insert', (req, res) => {
    let provider = req.query.provider;
    let movie_name = req.query.movie_name;
    let quote = req.query.quote;
    let sql = 'INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)';
    db.run(sql, [provider, movie_name, quote], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('Insert success');
    });
});

app.post('/api/insert', (req, res) => {
    let provider = req.body.provider;
    let movie_name = req.body.movie_name;
    let quote = req.body.quote;
    let sql = 'INSERT INTO movie_quotes (provider, movie_name, quote) VALUES (?, ?, ?)';
    db.run(sql, [provider, movie_name, quote], (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Internal Server Error');
            return;
        }
        res.send('Insert success');
    });
});




module.exports = app;
