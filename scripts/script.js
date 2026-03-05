
const categoriesContainer = document.getElementById('categories-container')

const loadCategories = async () => {
    // fetch('https://openapi.programming-hero.com/api/categories')
    // .then(res => res.json())
    // .then(data => displayCategories(data.categories))
    // .catch(e => console.log("Error is: ",e))

    const res = await fetch("https://openapi.programming-hero.com/api/categories")
    const data = await res.json();
    
    data.categories.forEach(category => {
        console.log(category);
        const btn = document.createElement('button')
        btn.className = "btn justify-start bg-transparent w-full border-none";
        btn.innerText = category.category_name;
        categoriesContainer.appendChild(btn);
        
    });
}
loadCategories();