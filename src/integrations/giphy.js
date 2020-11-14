'use strict';

const Fetch = require('../lib/fetch').doFetch;
const API_KEY = process.env.GIPHY_KEY;

const BASE_URL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=1&q=`;

const getGifs = async function getGifs(recipe) {

    return Fetch('GET', BASE_URL, false, { params: recipe });
};

module.exports = {
    getGifs,
};
