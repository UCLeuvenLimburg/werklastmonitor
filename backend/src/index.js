const config = require('./config');

const express = require('express');
const app = express();

const cors = require('cors');
const bodyParser = require('body-parser');
const morgan = require('morgan');

app.use(cors());
app.use(bodyParser.json());
app.use(morgan('combined'));

app.use(require('./routes/worksessionRouter'));

app.listen(config.port, () => {
	console.log(`API running on port ${config.port}`);
});
