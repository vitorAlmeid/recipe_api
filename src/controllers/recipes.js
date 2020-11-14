'use strict';
const recipePuppy = require('../integrations/recipePuppy');
const validateQuery = query => {

    if (!query.i) return { isValid: false, error: 'Invalid Query' };

    if (query.i.split(',').length > 3) return { isValid: false, error: 'Cant use more than three ingredients' };

    for (const item of query.i.split(',')) {
        if (item.trim().length < 3) {
            return { isValid: false, error: `Cant use this ingredient [${item}]` };
        }
    }

    return { isValid: true };
};

const getRecipes = async function (ingredients) {
    return new Promise( async (resolve, reject) => {

        const [error, recipes] = await to(recipePuppy.getRecipes(ingredients));

        if (error) {
            return reject(error);
        }

        resolve(recipes);
    });

};


module.exports = {

    async search(req, res) {

        const validation = validateQuery(req.query);

        if (!validation.isValid) return res.status(400).json({ error: validation.error });

        const recipes = await getRecipes(req.query.i.replace(' ', ''))

        if (!recipes) return res.status(204).json({ error: 'Recipe puppy unavailable'  });

        res.status(200).json({ data: recipes });
    }
}