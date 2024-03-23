const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const logger = require('morgan');

const routes = require('../routes/v1');

const corsOptions = {
    origin: ["http://localhost:5173", "http://localhost:5000"]
}

const app = express();

app.use(logger('dev'));
app.use(cookieParser())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

app.use('/api/v1', routes);

module.exports = app