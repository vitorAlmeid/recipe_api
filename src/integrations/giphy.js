'use strict';

const Fetch = require('../lib/fetch').doFetch;
const API_KEY = 'rcXN20npMs3UowQo9pe1QKGM9ctk51Ag';

const BASE_URL = `https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&limit=1&q=`;

const getGifs = async function getGifs(recipe) {

    return Fetch('GET', BASE_URL, false, { params: recipe });
};

module.exports = {
    getGifs,
};
