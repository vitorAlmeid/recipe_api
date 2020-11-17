# Recipes Api

API para entregar receitas com gifs.

## Como startar o projeto usando docker-compose
1 - Primeiramente, deve-se clonar o repo e certificar-se que tenha o docker-compose instalado, e então, vá até o diretório do projeto.

2 - Crie um .env.dev file no root do projeto e preencha conforme modelo presente em .env.exempĺe. (Faltará apenas a API key do giphy.)

3 - Execute docker-compose up --build -d no root do projeto 

Public routes
GET `/recipes/?i={ingredient_1},{ingredient_2}`

e.g: http://127.0.0.1/recipes?i=rice,shrimp

Response structure:
```{
    "keywords": ["rice","shrimp"],
    "recipes": [
        {
            "title": "Chicken Or Shrimp Creole Recipe",
            "ingredients": ["shrimp","rice","cajunseasoning"],
            "link": "http://cookeatshare.com/recipes/chicken-or-shrimp-creole-40042",
            "gif": "https://giphy.com/gifs/ingV3auQTOXSw"
        },
        {
            "title": "Simple Shrimp Stir-Fry",
            "ingredients": ["saladdressing","broccoli","shrimp","rice"],
            "link": "http://www.kraftfoods.com/kf/recipes/simple-shrimp-stir-fry-109909.aspx",
            "gif": "https://giphy.com/gifs/ingV3auQTOXSw"
        }
    ],
    "error": {
        "error": false
    }
}```




