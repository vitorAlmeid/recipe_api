'use strict';

// Constants
const PORT = 3000;

// App
const app = require('../config/express')();

app.listen(PORT, () =>
    console.info(`recipes server listening on port ${PORT}`),
);

module.exports = app;