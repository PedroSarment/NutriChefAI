export async function getRecipeImage(recipeTitle: string) {
    
    const response = await fetch(`http://localhost:3000/api/recipe-image?q=${recipeTitle}`);
    const data = await response.json();
    let imageList:string[] = [];
    for (let i = 0; i < 10; i++) {
        imageList.push(data.images_results[i].thumbnail)
    }
    return imageList;
}
