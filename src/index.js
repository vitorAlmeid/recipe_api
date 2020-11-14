'use strict';

// Constants
const PORT = 3000;

// App
const app = require('../config/express')();

global.to = require('../src/lib/promiseWrapper').to;

app.listen(PORT, () =>
    console.info(`recipes server listening on port ${PORT}`),
);

module.exports = app;