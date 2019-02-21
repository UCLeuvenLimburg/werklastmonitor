const config = require('./config');

const express = require('express');
const app = express();
const expressValidator = require('express-validator');

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const database = require('./database');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const passport = require('passport');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));
app.use(expressValidator());

app.use(session({
	secret: config.secret,
	store: new MongoStore({
		mongooseConnection: database.connection
	}),
	resave: false,
	saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

app.use('/labs', require('./routes/labRoutes'));
app.use('/worksessions', require('./routes/worksessionRoutes'));
app.use('/workdays', require('./routes/workdayRoutes'));
app.use('/milestones', require('./routes/milestoneRoutes'));
app.use('/courses', require('./routes/courseRoutes'));
app.use('/auth', require('./routes/authRoutes'));
app.use('/users', require('./routes/userRoutes'));
app.use('/programs', require('./routes/programRoutes'));
app.use('/static', express.static('static'));

app.listen(config.port, () => {
	console.log(`API running on port ${config.port}`);
});

// Necessary for testing
module.exports = app;
