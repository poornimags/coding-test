const express = require('express');
const controller = require('./controller');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use('/transformed-payload', controller);

app.listen(3000);

module.exports = app;