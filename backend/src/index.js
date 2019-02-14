const config = require('./config');

require('./database');

const express = require('express');
const app = express();
const expressValidator = require('express-validator');

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');

app.use(cors());
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(expressValidator());

// Authentication middlewares
app.use(require('cookie-parser')());
app.use(require('express-session')({
	secret: config.secret,
	saveUninitialized: true,
	resave: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/labs', require('./routes/labRoutes'));
app.use('/worksessions', require('./routes/worksessionRoutes'));
app.use('/workdays', require('./routes/workdayRoutes'));
app.use('/milestones', require('./routes/milestoneRoutes'));
app.use('/courses', require('./routes/courseRoutes'));
app.use('/auth', require('./routes/authRoutes'));

app.listen(config.port, () => {
	console.log(`API running on port ${config.port}`);
});

// Necessary for testing
module.exports = app;
