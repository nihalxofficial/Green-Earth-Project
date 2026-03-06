const categoriesContainer = document.getElementById('categories-container')
const allTreeBtn = document.getElementById("all-tree-btn");
const treeContainer = document.getElementById("tree-container");
const loadingSpinner = document.getElementById("loading-spinner");
const treeModal = document.getElementById("tree_modal");
const detailsContainer = document.getElementById('details_container');
const cartContainer = document.getElementById('cart-container');
const totalCartPrice = document.getElementById("total-cart-price");
const emptyElement = document.getElementById("empty-cart-message");
let cart = [];

allTreeBtn.addEventListener("click", () => {
    toggleButton(allTreeBtn);
    loadAllTrees();
});

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

const selectCategory = async (id) => {
    showLoading(true);
    const res = await fetch(`https://openapi.programming-hero.com/api/category/${id}`)
    const data = await res.json();
    displayTrees(data.plants);
}

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

const showLoading = (status) => {
    if(status){
        loadingSpinner.classList.remove(("hidden"));
        treeContainer.innerHTML="";
    }else{
        loadingSpinner.classList.add("hidden");
    }
}

const loadAllTrees = async () => {
    showLoading(true);
    const res = await fetch("https://openapi.programming-hero.com/api/plants")
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
            <img onclick="openTreeModal(${plant.id})" src="${plant.image}" alt="${plant.name}" class="w-full h-[200px] rounded-xl object-cover cursor-pointer">
            </div>
            <h2 class="font-semibold">${plant.name}</h2>
            <p class="text-sm text-gray-600 line-clamp-2">${plant.description}</p>
            <div class="flex justify-between">
                <button class="bg-green-300 text-green rounded-full px-3 py-1 text-sm">${plant.category}</button>
                <button class="font-semibold  ${plant.price >= 800 ? "text-red-600 ":"text-green-600"}">৳${plant.price}</button>
            </div>
        <button onclick="addToCart(${plant.id}, '${plant.name}', ${plant.price})" class="btn bg-green-700 text-white py-2 rounded-full"><i class="fa-solid fa-cart-shopping"></i> Add to Cart</button>
        `;

    treeContainer.appendChild(card);
    showLoading(false);
    })
}

const openTreeModal = async (id) => {    
    
    const res = await fetch(`https://openapi.programming-hero.com/api/plant/${id}`);
    const data = await res.json();
    const treeDetails = data.plants;
    detailsContainer.innerHTML = `
        <div class="modal-box">

            <div class="card p-4 space-y-3">
                <h2 class="font-bold text-2xl text-green-800">${treeDetails.name}</h2>

                <img src="${treeDetails.image}" 
                class="w-full h-[250px] rounded-xl object-cover">

                <h2 class="font-bold">
                    Category:
                    <span class="bg-green-500 text-white px-2 py-1 rounded-lg">
                        ${treeDetails.category}
                    </span>
                </h2>

                <p class="text-sm text-gray-600">${treeDetails.description}</p>

                <h2 class="font-bold text-2xl text-green-800">
                    ৳ ${treeDetails.price}
                </h2>
            </div>

            <div class="modal-action">
                <button onclick="addToCart(${treeDetails.id}, '${treeDetails.name}', ${treeDetails.price})"
                class="btn bg-green-700 text-white">
                <i class="fa-solid fa-cart-shopping"></i> Add to Cart
                </button>

                <form method="dialog">
                    <button class="btn">Close</button>
                </form>
            </div>
        </div>
        `;
    treeModal.showModal();
}

const addToCart = (id, name, price) => {

    const product = {
        id,
        name,
        price,
        quantity : 1,
    }
    const existingProduct = cart.find(item => item.id === product.id);

    if(existingProduct){
        existingProduct.quantity++;
    }else{
        cart.push(product);
    }  
    updateCart();
}

const updateCart = () => {
    cartContainer.innerHTML= "";

    if(cart.length === 0 ){
        emptyElement.classList.remove("hidden");
        totalCartPrice.innerText = 0;
        return
    }else{

    
    emptyElement.classList.add("hidden");
    let totalPrice = 0;
    // cartContainer.innerHTML = "";
    cart.forEach(item => {
        const itemPrice = item.price * item.quantity;
        totalPrice += itemPrice;        
        const cartItem = document.createElement("div");
        cartItem.className = "card card-body bg-green-50 font-semibold";
        cartItem.innerHTML = `
            <div class="flex justify-between items-center">
                <div>
                    <h2>${item.name}</h2>
                    <p>৳ ${item.price} x ${item.quantity}</p>
                </div>
                <button onclick="removeCart(${item.id})" class="btn btn-ghost">X</button>
            </div>
            <p class="item-prices text-right font-semibold text-md text-green-800">৳ ${itemPrice}</p>
        `;
        cartContainer.appendChild(cartItem);
        totalCartPrice.innerText = totalPrice;
    })}
}

const removeCart = (treeId) => {
    const updateCartElements = cart.filter(item => item.id !== treeId);
    cart = updateCartElements;
    updateCart();
    
}

loadCategories();
loadAllTrees();