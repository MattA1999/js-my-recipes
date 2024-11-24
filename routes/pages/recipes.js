
const router = require('express').Router()
const { response } = require('express')
const { request } = require('http')
const path = require('path')
const { receiveMessageOnPort } = require('worker_threads')
const root = path.join(__dirname, '..', '..', 'public')
router.get('/', (_, response) => response.sendFile('index.htm', { root }))

//enable file system interaction
const fs = require('fs');

//connect to json file
const getRecipe = path.join(__dirname, '../../data/recipes.json') //might need an additional '../'

//get data from JSON file
const loadRecipe = () => {
    const data = fs.readFileSync(getRecipe, 'utf-8')
    return JSON.parse(data)
}

//route to grab id, title, image, ingredients, instructions, preptime, difficulty.
router.get('/',(request, response) =>{
    const recipes = loadRecipe() //load recipes from JSON array
    const recipeData /*recipesResult*/ = recipes.map(recipe => ({
        id: recipe.id, 
        title: recipe.title,
        image: recipe.image,
        prepTime: recipe.prepTime,
        difficulty: recipe.difficulty
    })) 
    response.json(recipeData)
})

//route to add new recipe 
router.post('/recipe/add', (request, response) => {
    const recipes = loadRecipe() //load recipes from JSON array
    const newRecipe = request.body

    //create id for added recipe
    newRecipe.id = recipes.length + 1
    
    //save to array
    recipes.push(newRecipe)

    //save array to json file
    fs.writeFileSync(getRecipe, JSON.stringify(recipes, null, 2)) 

})

//route to get recipe by id
router.get('/recipe/:id', (request, response) =>{
    const recipes = loadRecipe() //load recipes from JSON array
    recipeID = parseInt(request.params.id, 10) //convert the id into an int instead of a string.
    const recipeSearch = recipes.find(recipe => recipe.id === recipeID)    

    response.json(recipeSearch)
})

module.exports = router