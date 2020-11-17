'use strict';
const recipePuppy = require('../integrations/recipePuppy');
const giphy = require('../integrations/giphy');
const Redis = require('../lib/redis');
const Utils = require('../lib/utils');

const validateQuery = function validateQuery(query) {

    if (!query.i) return { isValid: false, error: 'Invalid Query' };

    if (query.i.split(',').length > 3) return { isValid: false, error: 'Cant use more than three ingredients' };

    for (const item of query.i.split(',')) {
        if (item.trim().length < 3) {
            return { isValid: false, error: `Cant use this ingredient [${item}]` };
        }
    }

    return { isValid: true };
};

const getRecipesWithGifs = async function (ingredients) {
    const keywords = ingredients.split(',').sort();
    return new Promise(async (resolve, reject) => {
        const [error, recipes] = await to(recipePuppy.getRecipes(ingredients));

        if (error) {
            return reject({ 'keywords': keywords, 'recipes': [], 'error': { 'error': true, 'message': error.message } });
        }
        if (recipes.results.length === 0) {
            return resolve({ 'keywords': keywords, 'recipes': [], 'error': { 'error': false } });
        }
        const promises = recipes.results.map(async recipe => {
            return new Promise(async (resolve, reject) => {
                const [err, gifs] = await to(giphy.getGifs(recipe.title));
                if (err) {
                    return reject({ 'keywords': keywords, 'recipes': [], 'error': { 'error': true, 'message': err.message } });
                }
                resolve({
                    'title': recipe.title,
                    'ingredients' : Utils.trimAll(recipe.ingredients).split(','),
                    'link' : recipe.href,
                    'gif' : gifs.data[0].url,
                });
            });
        });
        try {
            const recipesList = await Promise.all(promises);
            resolve({ 'keywords': keywords, 'recipes': recipesList, 'error': { 'error': false } });
        } catch (e) {
            reject(e);
        }

    });

};

module.exports = {

    async search(req, res) {

        const validation = validateQuery(req.query);
        if (!validation.isValid) return res.status(400).json({ error: validation.error });

        const trimmedIngredients = Utils.trimAll(req.query.i);

        Redis.get(trimmedIngredients, async (error, cachedResult) => {
            if (error) {
                console.error(error);
            };

            if (cachedResult) {
                res.status(200).json(cachedResult);
            } else {
                const [recipesError, recipes] = await to(getRecipesWithGifs(trimmedIngredients));
                if (recipesError) {
                    return res.status(503).json(recipesError);
                }

                Redis.set(trimmedIngredients, recipes, 86400);

                res.status(200).json(recipes);
            }

        });
    },
};
