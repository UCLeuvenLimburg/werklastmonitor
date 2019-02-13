const config = require('./config');

require('./database');

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use('/labs', require('./routes/labRoutes'));
app.use('/worksessions', require('./routes/worksessionRoutes'));
app.use('/workdays', require('./routes/workdayRoutes'));
app.use('/milestones', require('./routes/milestoneRoutes'));


app.listen(config.port, () => {
	console.log(`API running on port ${config.port}`);
});

module.exports = app;
