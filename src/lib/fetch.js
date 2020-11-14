'use strict';

const https = require('https');
const fetch = require('node-fetch');
const CustomError = require('../lib/customError').CustomError;

const doFetch = function doFetch(method, path, auth, opts = {}) {
    return new Promise((resolve, reject) => {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });

        const options = {
            method: method,
            headers: opts.headers || {}
        };

        if (auth) {
            options.headers = { ...options.headers, ...{ 'Authorization': auth } };
        }

        if (opts.body) {
            options.body = JSON.stringify(opts.body);
            options.headers = { ...options.headers, ...{ 'Content-Type': 'application/json' } };
        }

        let params = opts.params ? opts.params : '';

        return fetch(`${path}${params}`, options)
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
                return reject(new CustomError(response.statusText, response.status));
            })
            .then((data) => {
                if (data.error) {
                    return reject(new CustomError(data.msg || data.message, data.code));
                }
                return resolve(data);
            })
            .catch((error) => {
                return reject(error);
            });
    });
};

module.exports = {
    doFetch
};
