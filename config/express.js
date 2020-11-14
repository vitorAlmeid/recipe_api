
'use strict';

const app = require('express')();

const bodyParser = require('body-parser');

const recipesRoutes = require('../src/routes/recipes');

module.exports = () => {
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    app.use(recipesRoutes);

    return app;
};
