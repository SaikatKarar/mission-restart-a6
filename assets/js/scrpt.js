let allProducts = [];
let cart = JSON.parse(localStorage.getItem("cart")) || [];


// ==========================================
// DOM READY
// ==========================================
document.addEventListener("DOMContentLoaded", init);

function init() {

    updateCartUI();

    const isHome = document.getElementById("trendingProducts");
    const isProducts = document.getElementById("productsGrid");

    if (isHome) loadTrendingProducts();

    if (isProducts) {
        loadCategories();
        loadAllProducts();
    }
}


// ==========================================
// NAVBAR MENU
// ==========================================
function handleMenu() {
    const menu = document.getElementById("nav-dialog");
    menu.classList.toggle("translate-x-full");
}


// ==========================================
// SPINNER
// ==========================================
const spinner = document.getElementById("loadingSpinner");

function showSpinner() {
    spinner?.classList.remove("hidden");
}

function hideSpinner() {
    spinner?.classList.add("hidden");
}



// ==========================================
// ================= CART SYSTEM ============
// ==========================================

const cartCount = document.getElementById("cart-count");

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartUI() {
    if (cartCount) cartCount.innerText = cart.length;
}

function addToCart(id) {

    const product = allProducts.find(p => p.id == id);
    if (!product) return;

    const exists = cart.find(p => p.id == id);

    if (exists) {
        alert("Already in cart");
        return;
    }

    cart.push(product);

    saveCart();
    updateCartUI();

    alert("Added to cart");
}

// ==========================================
// CART SIDEBAR SYSTEM
// ==========================================

const cartBtn = document.getElementById("cart-btn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");


cartBtn?.addEventListener("click", () => {
    cartSidebar.classList.remove("translate-x-full");
    renderCartItems();
});

closeCart?.addEventListener("click", () => {
    cartSidebar.classList.add("translate-x-full");
});


function renderCartItems() {

    cartItemsContainer.innerHTML = "";

    let total = 0;

    cart.forEach((item, index) => {

        total += item.price;

        const div = document.createElement("div");

        div.className =
            "flex items-center gap-4 border-b pb-3";

        div.innerHTML = `
        <img src="${item.image}" class="w-16 h-16 object-contain"/>

        <div class="flex-1">
            <h4 class="text-sm font-semibold">${item.title.slice(0, 30)}</h4>
            <p class="text-sm text-gray-500">$${item.price}</p>
        </div>

        <button onclick="removeFromCart(${index})"
class="p-2 rounded hover:bg-red-50 text-red-500 hover:text-red-600 allow-pointer transition">
    <i class="fa-solid fa-trash cursor-pointer"></i>
</button>

        `;

        cartItemsContainer.appendChild(div);
    });

    cartTotal.innerText = "$" + total.toFixed(2);
}


function removeFromCart(index) {

    cart.splice(index, 1);

    saveCart();
    updateCartUI();
    renderCartItems();
}

// ==========================================
// ================ HOME PAGE ===============
// ==========================================
const trendingContainer = document.getElementById("trendingProducts");

async function loadTrendingProducts() {

    try {

        showSpinner();

        const res = await fetch("https://fakestoreapi.com/products");
        const products = await res.json();

        allProducts = products;

        const topThree = products
            .sort((a, b) => b.rating.rate - a.rating.rate)
            .slice(0, 3);

        displayTrendingProducts(topThree);

        hideSpinner();

    } catch (err) {
        console.log(err);
    }
}



function displayTrendingProducts(products) {

    if (!trendingContainer) return;

    trendingContainer.innerHTML = "";

    products.forEach(product => {

        const shortTitle =
            product.title.length > 40
                ? product.title.slice(0, 40) + "..."
                : product.title;

        const card = document.createElement("div");

        card.className =
            "bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group";

        card.className =
            "bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group";

        card.innerHTML = `
      <div class="bg-gray-200 p-8 flex justify-center overflow-hidden">
        <img src="${product.image}"
          class="h-50 object-contain group-hover:scale-110 transition duration-300" />
      </div>

      <div class="p-5 space-y-3">

        <div class="flex justify-between items-center text-sm">

          <span class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
            ${product.category}
          </span>

          <span class="flex items-center gap-1 text-yellow-500">
            <i class="fa-solid fa-star"></i>
            <span class="text-gray-400">${product.rating.rate} (${product.rating.count})</span>
          </span>

        </div>

        <h3 class="font-semibold text-gray-800">${shortTitle}</h3>

        <p class="text-xl font-bold text-gray-900">$${product.price}</p>

        <div class="flex gap-3 pt-2">

          <button onclick="openModal(${product.id})" 
            class="details-btn flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition cursor-pointer">
            <i class="fa-regular fa-eye"></i>
            Details
          </button>

          <button onclick="addToCart(${product.id})"
            class="flex-1 bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 flex items-center justify-center gap-2 transition cursor-pointer">
            <i class="fa-solid fa-cart-plus"></i>
            Add
          </button>

        </div>
      </div>
    `;

        trendingContainer.appendChild(card);
    });
}



// ==========================================
// ================ PRODUCTS PAGE ===========
// ==========================================

const tabsContainer = document.getElementById("categoryTabs");
const grid = document.getElementById("productsGrid");



async function loadAllProducts() {

    showSpinner();

    const res = await fetch("https://fakestoreapi.com/products");
    allProducts = await res.json();

    displayAllProducts(allProducts);

    hideSpinner();
}



async function loadCategories() {

    if (!tabsContainer) return;

    const res = await fetch("https://fakestoreapi.com/products/categories");
    const categories = await res.json();

    createTab("All", true);

    categories.forEach(cat => createTab(cat));
}



function createTab(category, active = false) {

    const btn = document.createElement("button");

    btn.innerText = category;

    const normalClass =
        "px-5 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-white hover:shadow transition cursor-pointer text-sm font-medium";

    const activeClass =
        "px-5 py-2 rounded-full bg-indigo-600 text-white shadow-md transition cursor-pointer text-sm font-medium";

    btn.className = active ? activeClass : normalClass;

    btn.addEventListener("click", () => {

        // reset all
        document.querySelectorAll("#categoryTabs button")
            .forEach(b => b.className = normalClass);

        // active current
        btn.className = activeClass;

        if (category === "All") {
            displayAllProducts(allProducts);
        } else {
            loadProductsByCategory(category);
        }
    });

    tabsContainer.appendChild(btn);
}



async function loadProductsByCategory(category) {

    showSpinner();

    const res = await fetch(
        `https://fakestoreapi.com/products/category/${category}`
    );

    const products = await res.json();

    displayAllProducts(products);

    hideSpinner();
}



function displayAllProducts(products) {

    if (!grid) return;

    grid.innerHTML = "";

    products.forEach(product => {

        const shortTitle =
            product.title.length > 35
                ? product.title.slice(0, 35) + "..."
                : product.title;

        const card = document.createElement("div");

        card.className =
            "bg-white rounded-xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden group";

        card.innerHTML = `
      <div class="bg-gray-200 p-8 flex justify-center overflow-hidden">
        <img src="${product.image}"
          class="h-50 object-contain group-hover:scale-110 transition duration-300" />
      </div>

      <div class="p-5 space-y-3 text-left">

        <div class="flex justify-between items-center text-sm">
          <span class="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-xs font-medium">
            ${product.category}
          </span>

          <span class="flex items-center gap-1 text-gray-400">
             <i class="fa-solid fa-star text-yellow-500"></i> ${product.rating.rate}
          </span>
        </div>

        <h3 class="font-semibold text-gray-800">${shortTitle}</h3>

        <p class="text-xl font-bold text-gray-900">$${product.price}</p>

        <div class="flex gap-3 pt-2">
          <button onclick="openModal(${product.id})"
            class="flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-50 cursor-pointer">
             <i class="fa-regular fa-eye"></i>
            Details
          </button>

          <button onclick="addToCart(${product.id})"
            class="flex-1 bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 cursor-pointer">
            Add
          </button>
        </div>
      </div>
    `;

        grid.appendChild(card);
    });
}



// ==========================================
// ================ MODAL ===================
// ==========================================
const modalAddBtn = document.getElementById("modalAddBtn");

let currentModalProductId = null;

const modal = document.getElementById("productModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");
const modalPrice = document.getElementById("modalPrice");
const modalRating = document.getElementById("modalRating");
const closeModalBtn = document.getElementById("closeModal");



async function openModal(id) {

    try {
        currentModalProductId = id;

        modal.classList.remove("hidden");

        showSpinner();

        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        const product = await res.json();

        modalImg.src = product.image;
        modalTitle.innerText = product.title;
        modalDesc.innerText = product.description;
        modalPrice.innerText = "$" + product.price;

        modalRating.innerHTML =
            `<i class="fa-solid fa-star text-yellow-500"></i> ${product.rating.rate}`;

    } catch (error) {
        console.log("Error loading product:", error);
    }

    hideSpinner()
}

modalAddBtn?.addEventListener("click", () => {

    if (!currentModalProductId) return;

    addToCart(currentModalProductId);

    modal.classList.add("hidden");
});




function closeModalFunc() {
    modal.classList.add("hidden");
}

closeModalBtn?.addEventListener("click", closeModalFunc);



