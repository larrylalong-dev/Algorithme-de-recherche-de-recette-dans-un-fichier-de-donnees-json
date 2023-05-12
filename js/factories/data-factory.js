
function recipesFactory (data) {
    const { id, name, servings, ingredients, time, description, appliance, ustensils } = data

    function showRecipes() {
        let ingredientItem
        let quantityItem
        let unitItem
        let ingredientTag = ``
        for (const item of ingredients ){
            ingredientItem = item
            quantityItem = item.quantity
            unitItem = item.unit
            ingredientTag += `<li><strong>${item.ingredient ?? ''}:</strong> ${item.quantity ?? ''} ${item.unit ?? ''}</li>`
        }
        return `
        <div class="card mb-5" id="card-recipe-${id}" aria-hidden="true">
            <img src="public/assets/image-recette.jpg" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title placeholder-glow d-flex justify-content-between">
                    <span class="col-9">${name}</span>
                    <span class="d-flex align-items-center"><i class="card-icon-time mx-2"></i>${time}min</span>
                </h5>
                <div class="d-flex justify-content-between">
                    <ul class="ingredients-list" id="ingredients-list">
                    ${ingredientTag}
                    </ul>
                    <span class="col-6 card-description">${description}</span>
                </div>
            </div>
        </div>
        `                
    }
    
    return {
        id, name, servings, ingredients, time, description, appliance, ustensils,
        showRecipes,
    }
}


