function handleMenu() {
    const menu = document.getElementById("nav-dialog");
    menu.classList.toggle("translate-x-full");
}



// Trending Products in home page

const container = document.getElementById("trendingProducts");

async function loadTrendingProducts() {
    try {
        const res = await fetch("https://fakestoreapi.com/products");
        const products = await res.json();

        const topThree = products
            .sort((a, b) => b.rating.rate - a.rating.rate)
            .slice(0, 3);

        displayProducts(topThree);

    } catch (error) {
        console.log("Error:", error);
    }
}


function displayProducts(products) {

    container.innerHTML = "";

    products.forEach(product => {

        const shortTitle =
            product.title.length > 40
                ? product.title.slice(0, 40) + "..."
                : product.title;

        const card = document.createElement("div");

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

          <button
            class="flex-1 border rounded-lg py-2 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2 transition cursor-pointer">
            <i class="fa-regular fa-eye"></i>
            Details
          </button>

          <button
            class="flex-1 bg-indigo-600 text-white rounded-lg py-2 hover:bg-indigo-700 flex items-center justify-center gap-2 transition cursor-pointer">
            <i class="fa-solid fa-cart-plus"></i>
            Add
          </button>

        </div>
      </div>
    `;

        container.appendChild(card);
    });
}

loadTrendingProducts();

