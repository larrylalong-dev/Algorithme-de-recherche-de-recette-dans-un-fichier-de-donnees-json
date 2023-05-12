async function getRecipes() {
    try {
        const response = await fetch('data/recipes.json')
        const dataRecipes = await response.json();
        return dataRecipes;
    } catch (err) {
        console.log(err)
    }
}

const globalSearchInput = document.querySelector('.input-search');
const dropdownToggle = document.querySelectorAll('.dropdown-toggle');
const arrowExpand = document.querySelectorAll('.expand');
const dropdownMenu = document.querySelectorAll('.dropdown-menu');
const ingredientsList = document.querySelector('.ingredient-list');
const applianceList = document.querySelector('.appliance-list');
const ustensilsList = document.querySelector('.ustensil-list');
const tagList = document.getElementById('tags');
let recipesList = document.getElementById('bloc-recipe');

let itemsRecipes = [];
let remainingRecipes = [];
let tagSelected = [];

function reloadRemainingRecipes(){
    remainingRecipes = itemsRecipes
}

function loadSearchData (dataRecipes){
    displayOption(dataRecipes, "ingredient");
    displayOption(dataRecipes, "appliance");
    displayOption(dataRecipes, "ustensils");

    dataRecipes.forEach(recipes => itemsRecipes.push(recipes))
    remainingRecipes = itemsRecipes
}

//Componnent d'affichage des resultats des recettes 
function displayRecipes(cardRecipes) {
    recipesList.innerHTML = "";
    cardRecipes.forEach(item => {
        const recipesModel = recipesFactory(item)
        const recipesDOM = recipesModel.showRecipes(item)
        recipesList.innerHTML += recipesDOM
    })

    displayOption(cardRecipes, "ingredient");
    displayOption(cardRecipes, "appliance");
    displayOption(cardRecipes, "ustensils");

    if (recipesList.innerHTML == "") {
        recipesList.innerHTML = `<p class="no-found">Aucune recette ne correspond à votre critère… vous pouvez chercher « tarte aux pommes », « poisson »</p>`
    }
}

//Affichage de la liste des options par ingredients, appareils et ustensils 
function displayOption(recipes, optionCategorie) {
    const ingredientsList = document.querySelector('.ingredient-list');
    const applianceList = document.querySelector('.appliance-list');
    const ustensilsList = document.querySelector('.ustensil-list');

    let ingredients = [];
    let appliances = [];
    let ustensiles = [];

    recipes.forEach((recipe) => {
        recipe.ingredients.forEach((ingredient) => {
            ingredients.push(ingredient.ingredient.toLowerCase());
        });
        recipe.ustensils.forEach(ustensil => ustensiles.push(ustensil.toLowerCase()))
        appliances.push(recipe.appliance.toLowerCase())
    })

    const filteredIngredients = Array.from(new Set(ingredients));
    const filteredAppliance = Array.from(new Set(appliances));
    const filteredUstensiles = Array.from(new Set(ustensiles));

    switch (optionCategorie) {
        case "ingredient":
            ingredientsList.innerHTML = ``;
            filteredIngredients.forEach(item => {
                ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item ingredient-item " href="#">${item}</a></li> `
            })
            break;
        case "appliance":
            applianceList.innerHTML = ``;
            filteredAppliance.forEach(item => {
                applianceList.innerHTML += `<li class="col-4 bg-success"><a class="dropdown-item appliance-item" href="#">${item}</a></li>`
            })
            break;
        case "ustensils":
            ustensilsList.innerHTML = ``;
            filteredUstensiles.forEach(item => {
                ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item ustensil-item" href="#">${item}</a></li>`
            })
            break;
        default:
            break;
    }

}

//Création d'un tag après avoir cliquer sur un item de la liste des options 
function createTag(value) {
    let buttonTag = document.createElement('button');
    let spanIcon = document.createElement('span');
    let img = document.createElement('img');
    buttonTag.classList.add('tag-item', 'btn', 'm-3');
    spanIcon.classList.add('delete-tag');
    img.classList.add('delete-tag-icon');
    img.setAttribute('src', './public/assets/icons/close-icon.png')

    tagList.appendChild(buttonTag);
    buttonTag.textContent = value;
    buttonTag.appendChild(spanIcon);
    spanIcon.appendChild(img);

     deleteTag()
}

//Fonction de suppression d'un tag au clic dessus 
function deleteTag() {
    let buttonTag = document.querySelectorAll('.tag-item')
    buttonTag.forEach(button => {
        button.addEventListener('click', function (e) {
            e.target.remove()
            reloadRemainingRecipes()
            tagSelected = tagSelected.filter(thistag => thistag != e.target.textContent)
            tagSelected.forEach(tag => {
                UpdateRecipes(tag)
            })
            UpdateRecipes(globalSearchInput.value)
            reloadRecipesList()

        })
    })
}

//Mise à jour de la liste des recettes si il n'y a plus de valeur disponible 
function reloadRecipesList(){
    if(tagList.children.length == 0 && globalSearchInput.value == ""){
        recipesList.innerHTML = ""
        reloadRemainingRecipes()
    }
    displayRecipes(remainingRecipes);
}

// mise à jour de la liste des recettes après avoir supprimer un tag 
function UpdateRecipes(value) {
    
    const foundIngredients = remainingRecipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(value.toLowerCase())));
    const foundAppliance = remainingRecipes.filter(item => item.appliance.toLowerCase().includes(value.toLowerCase()));
    const foundUstensils = remainingRecipes.filter(item => item.ustensils.find(ustensil => ustensil.toLowerCase().includes(value.toLowerCase())));
    const foundDescription = remainingRecipes.filter(item => item.description.toLowerCase().includes(value.toLowerCase()));
    const foundRecipesName = remainingRecipes.filter(item => item.name.toLowerCase().includes(value.toLowerCase()));
    const results = [...new Set([...foundIngredients, ...foundUstensils, ...foundAppliance, ...foundDescription, ...foundRecipesName])]
    
    remainingRecipes = results
}

// recherche des recettes par nom, ingrédients et description avec la barre principale de la page.
globalSearchInput.addEventListener('keyup', function (e){
    let value = e.target.value.toLowerCase()


    const foundRecipes = remainingRecipes.filter(item => item.name.toLowerCase().includes(value));
    const foundIngredients = remainingRecipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(value)));
    const foundDescription = remainingRecipes.filter(item => item.description.toLowerCase().includes(value));
 
    const results = [...new Set([...foundRecipes, ...foundIngredients, ...foundDescription])]

    remainingRecipes = results
    if(value.length >= 3 ){
        recipesList.innerHTML = "";
        displayRecipes(remainingRecipes)
    } else {
        reloadRemainingRecipes()
        tagSelected.forEach(tag => {
            console.log(tag)
            UpdateRecipes(tag)
        })
    }

    reloadRecipesList()

})

//recherche des recettes par ingredients, appareils et ustensils au click sur une valeur des filtres d'option.
dropdownMenu.forEach(item => {
    item.addEventListener("click", function (e, categorie){
        e.preventDefault()
        let itemContent = e.target.textContent
        tagSelected.push(itemContent)

        createTag(itemContent)
        if(e.target.classList.contains('ingredient-item')){
            categorie = "ingredient"
            tagList.lastChild.classList.add('btn-primary')
        } else if (e.target.classList.contains('appliance-item')){
            categorie = "appliance"
            tagList.lastChild.classList.add('btn-success')
        } else if (e.target.classList.contains('ustensil-item')){
            categorie = "ustensils"
            tagList.lastChild.classList.add('btn-danger')
        }

        searchRecipesByTags(itemContent, categorie)

    })
})

function searchRecipesByTags(tag, categorie){

    let recipes = []; 
    let results;

    recipes = remainingRecipes;

    switch (categorie) {
        case "ingredient":
            const foundIngredients = recipes.filter(item => item.ingredients.find(el => el.ingredient.toLowerCase().includes(tag.toLowerCase())));
            results = [...new Set([...foundIngredients])]
            break;
        case "appliance":
            const foundAppliance = recipes.filter(item => item.appliance.toLowerCase().includes(tag.toLowerCase()));
            results = [...new Set([...foundAppliance])]
            break;
        case "ustensils":
            const foundUstensil = recipes.filter(item => item.ustensils.find(ustensil => ustensil.toLowerCase().includes(tag.toLowerCase())))
            results = [...new Set([...foundUstensil])]
            break;
        default:
            break;
    }

    remainingRecipes = results;

    recipesList.innerHTML = "";
    displayRecipes(remainingRecipes)
}

// recherche des recettes par input dropdown 
dropdownToggle.forEach(dropdown => {
    dropdown.addEventListener("click", function (e) {
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.toggle('rotate')

    })
    dropdown.addEventListener("blur", function (e) {
        let thisDrop = e.target;
        thisDrop.nextElementSibling.classList.remove('rotate')

    })
    dropdown.addEventListener('keyup', function (e) {
        let newIngredientList = [];
        let newApplianceList = [];
        let newUstensilList = [];

        itemsRecipes.forEach(thisData => {
            thisData.ingredients.forEach(ingredient => {
                newIngredientList.push(ingredient.ingredient.toLowerCase())
            })
            thisData.ustensils.forEach(ustensil => newUstensilList.push(ustensil.toLowerCase()))
            newApplianceList.push(thisData.appliance.toLowerCase())
        })

        const ingredientsListToFilter = Array.from(new Set(newIngredientList))

        const applianceListToFilter = Array.from(new Set(newApplianceList))

        const ustensilsListToFilter = Array.from(new Set(newUstensilList))

        const searchValue = e.target.value

        const foundIngredientsList = ingredientsListToFilter.filter(item => item.includes(searchValue.toLowerCase()))
        const foundApplianceList = applianceListToFilter.filter(item => item.includes(searchValue.toLowerCase()))
        const foundUstensilList = ustensilsListToFilter.filter(item => item.includes(searchValue.toLowerCase()))

        if (searchValue == "") {
            displayOption(itemsRecipes, "ingredient");
            displayOption(itemsRecipes, "appliance");
            displayOption(itemsRecipes, "ustensils");
        }

        if (searchValue.length > 2) {
            if (e.target.classList.contains('btn-primary')) {
                ingredientsList.innerHTML = ""
                foundIngredientsList.forEach(item => {
                    ingredientsList.innerHTML += `<li class="col-4 bg-primary"><a class="dropdown-item ingredient-item" href="#">${item}</a></li> `
                })

            }

            if (e.target.classList.contains('btn-success')) {
                applianceList.innerHTML = ""
                foundApplianceList.forEach(item => {
                    applianceList.innerHTML += `<li class="col-4 bg-success"><a class="dropdown-item appliance-item" href="#">${item}</a></li> `
                })

            }

            if (e.target.classList.contains('btn-danger')) {
                ustensilsList.innerHTML = ""
                foundUstensilList.forEach(item => {
                    ustensilsList.innerHTML += `<li class="col-4 bg-danger"><a class="dropdown-item ustensil-item" href="#">${item}</a></li> `
                })

            }
        }

    })
})


async function init() {
    const data = await getRecipes()
    const dataRecipe = data.recipes
    loadSearchData(dataRecipe)
    displayRecipes(dataRecipe)
}

init();