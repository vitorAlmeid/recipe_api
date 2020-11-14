'use strict';

const env = require('../config/env');
env();

const app = require('../config/express')();

global.to = require('../src/lib/promiseWrapper').to;

app.listen(process.env.SERVER_PORT, () =>
    console.info(`recipes server listening on port ${process.env.SERVER_PORT}`),
);

module.exports = app;
