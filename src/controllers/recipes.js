'use strict';
const recipePuppy = require('../integrations/recipePuppy');
const giphy = require('../integrations/giphy');
const Redis = require('../lib/redis');

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
    return new Promise(async (resolve, reject) => {
        const recipeList = [];
        const keywords = ingredients.split(',').sort();
        const [error, recipes] = await to(recipePuppy.getRecipes(ingredients));

        if (error) {
            return reject(error);
        }
        if (recipes.results.length === 0) {
            return reject({ message: 'no recipes found' });
        }

        for (const recipe of recipes.results) {
            const [err, gifs] = await to(giphy.getGifs(recipe.title));
            if (err) {
                continue;
            }
            recipeList.push({
                'title': recipe.title,
                'ingredients' : recipe.ingredients,
                'link' : recipe.href,
                'gif' : gifs.data[0].url,
            });

        };

        resolve({ 'keywords': keywords, 'recipes': recipeList });
    });

};

module.exports = {

    async search(req, res) {

        const validation = validateQuery(req.query);
        if (!validation.isValid) return res.status(400).json({ error: validation.error });

        const searchRegExp = new RegExp(' ', 'g');

        const trimmedIngredients = req.query.i.replace(searchRegExp, '');

        Redis.get(trimmedIngredients, async (error, cachedResult) => {
            if (error) {
                console.error(error);
            };

            if (cachedResult) {
                res.status(200).json(cachedResult);
            } else {
                const recipes = await getRecipesWithGifs(trimmedIngredients);

                if (!recipes) return res.status(204).json({ error: 'Recipe puppy unavailable'  });

                Redis.set(trimmedIngredients, recipes, 86400);

                res.status(200).json(recipes);
            }

        });
    },
};
