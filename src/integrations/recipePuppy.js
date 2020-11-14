'use strict';

const Fetch = require('../lib/fetch').doFetch;
const BASE_URL = 'http://www.recipepuppy.com/api/?i=';

const getRecipes = async function getRecipes(ingredients) {

    return Fetch('GET', BASE_URL, false, { params: ingredients });
};

module.exports = {
    getRecipes,
};
