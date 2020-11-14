'use strict';

const router = require('express').Router();

const recipesController = require('../controllers/recipes');

router.get('/recipes', recipesController.search);

module.exports = router;