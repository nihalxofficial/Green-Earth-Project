const categoriesContainer = document.getElementById('categories-container')
const allTreeBtn = document.getElementById("all-tree-btn");
const treeContainer = document.getElementById("tree-container");
const loadingSpinner = document.getElementById("loading-spinner");



const showLoading = (status) => {
    if(status){
        loadingSpinner.classList.remove(("hidden"));
        treeContainer.innerHTML="";
    }else{
        loadingSpinner.classList.add("hidden");
    }
}


const loadCategories = async () => {
    // fetch('https://openapi.programming-hero.com/api/categories')
    // .then(res => res.json())
    // .then(data => displayCategories(data.categories))
    // .catch(e => console.log("Error is: ",e))

    const res = await fetch("https://openapi.programming-hero.com/api/categories")
    const data = await res.json();
    
    data.categories.forEach(category => {
        // console.log(category);
        const btn = document.createElement('button')
        btn.className = "btn justify-start bg-transparent w-full border-none";
        btn.innerText = category.category_name;
        btn.onclick = () => {
            selectCategory(category.id);
            toggleButton(btn);
        }
        
        categoriesContainer.appendChild(btn);
        
    });
}

allTreeBtn.addEventListener("click", () => {
    toggleButton(allTreeBtn);
    loadAllTrees();
});

const toggleButton = (btn) => {
    document.querySelectorAll("#categories-container button, #all-tree-btn").forEach(b => {
        b.classList.remove("btn-success");
        b.classList.remove("text-white");
        b.classList.add("bg-transparent");
    });

    // Add active class to clicked button
    btn.classList.add("btn-success");
    btn.classList.add("text-white");
    btn.classList.remove("bg-transparent");
}




const loadAllTrees = async () => {
    showLoading(true);
    const res = await fetch("https://openapi.programming-hero.com/api/plants")
    const data = await res.json();
    displayTrees(data.plants);
}

allTreeBtn.addEventListener("click", loadAllTrees);

const selectCategory = async (id) => {
    showLoading(true)
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    const data = await res.json();
    displayTrees(data.plants);
}


const displayTrees = (plants) => {    
    treeContainer.innerHTML = "";
    plants.forEach(plant => {
        const card = document.createElement("div");
        card.className = "card bg-white rounded-xl shadow-md p-3 space-y-2";
        card.innerHTML = `
        <div class="image ">
            <img src="${plant.image}" alt="${plant.name}" class="w-full h-[200px] rounded-xl object-cover">
            </div>
            <h2 class="font-semibold">${plant.name}</h2>
            <p class="text-sm text-gray-600 line-clamp-2">${plant.description}</p>
            <div class="flex justify-between">
                <button class="bg-green-300 text-green rounded-full px-3 py-1 text-sm">${plant.category}</button>
                <button class="font-semibold">৳${plant.price}</button>
            </div>
        <button class="btn bg-green-700 text-white py-2 rounded-full"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
        `;

    treeContainer.appendChild(card);
    showLoading(false);
    })
}

loadCategories();
loadAllTrees();