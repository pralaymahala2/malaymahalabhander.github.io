// ===============================
// MALAY MAHALA BHANDER
// Main Website JavaScript
// ===============================


// ===============================
// DEFAULT PRODUCTS
// ===============================

const defaultProducts = [
    {
        id: 1,
        name: "Potato",
        quantity: "5 KG",
        price: 75,
        category: "Vegetables",
        image: "images/potato.jpg",
        available: true
    },
    {
        id: 2,
        name: "Soybean Oil",
        quantity: "1 Litre",
        price: 135,
        category: "Oil & Spices",
        image: "images/oil.jpg",
        available: true
    },
    {
        id: 3,
        name: "Moong Dal",
        quantity: "1 KG",
        price: 165,
        category: "Rice & Dal",
        image: "images/dal.jpg",
        available: true
    },
    {
        id: 4,
        name: "Tata Salt",
        quantity: "1 KG",
        price: 30,
        category: "Oil & Spices",
        image: "images/salt.jpg",
        available: true
    },
    {
        id: 5,
        name: "Parle-G Biscuits",
        quantity: "Small Pack",
        price: 10,
        category: "Biscuits & Snacks",
        image: "images/parleg_e.png",
        available: true
    },
    {
        id: 6,
        name: "Sprite",
        quantity: "2.250 Litre",
        price: 99,
        category: "Beverages",
        image: "images/sprite.png",
        available: true
    }
];


// ===============================
// DEFAULT CATEGORIES
// ===============================

const defaultCategories = [
    {
        id: "rice-dal",
        name: "Rice & Dal",
        bengali: "চাল ও ডাল",
        icon: "🍚"
    },
    {
        id: "oil-spices",
        name: "Oil & Spices",
        bengali: "তেল ও মশলা",
        icon: "🫗"
    },
    {
        id: "biscuits-snacks",
        name: "Biscuits & Snacks",
        bengali: "বিস্কুট ও স্ন্যাক্স",
        icon: "🍪"
    },
    {
        id: "dairy",
        name: "Dairy",
        bengali: "দুধ ও দুগ্ধজাত পণ্য",
        icon: "🥛"
    },
    {
        id: "beverages",
        name: "Beverages",
        bengali: "পানীয়",
        icon: "🥤"
    },
    {
        id: "home-care",
        name: "Home Care",
        bengali: "গৃহস্থালির জিনিস",
        icon: "🧹"
    },
    {
        id: "vegetables",
        name: "Vegetables",
        bengali: "সবজি",
        icon: "🥔"
    }
];


// ===============================
// STORAGE
// ===============================

function getProducts() {
    const saved = localStorage.getItem("groceryProducts");

    if (saved !== null) {
        return JSON.parse(saved);
    }

    return defaultProducts;
}


function getCategories() {
    const saved = localStorage.getItem("groceryCategories");

    if (saved !== null) {
        return JSON.parse(saved);
    }

    return defaultCategories;
}


function getOffers() {
    const saved = localStorage.getItem("groceryOffers");

    if (saved !== null) {
        return JSON.parse(saved);
    }

    return [];
}


// ===============================
// CART
// ===============================

function getCart() {
    return JSON.parse(localStorage.getItem("groceryCart")) || [];
}


function saveCart(cart) {
    localStorage.setItem("groceryCart", JSON.stringify(cart));
    updateCartCount();
}


function updateCartCount() {
    const cart = getCart();
    const count = document.getElementById("cartCount");

    if (count) {
        count.textContent = cart.length;
    }
}


// ===============================
// ADD TO CART
// ===============================

function addToCart(productId) {

    const products = getProducts();

    const product = products.find(
        p => Number(p.id) === Number(productId)
    );

    if (!product) {
        return;
    }

    if (product.available === false) {
        return;
    }

    const cart = getCart();

    cart.push({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        price: Number(product.price),
        image: product.image
    });

    saveCart(cart);

    // No popup / alert
}


// ===============================
// VIEW CART
// ===============================

function showCart() {
    window.location.href = "cart.html";
}


// ===============================
// CATEGORY RENDER
// ===============================

function renderCategories() {

    const container = document.querySelector("#categories > div");

    if (!container) {
        return;
    }

    // IMPORTANT:
    // If admin has not created category data yet,
    // keep the existing HTML categories.
    if (localStorage.getItem("groceryCategories") === null) {
        return;
    }

    container.innerHTML = "";

    const categories = getCategories();

    categories.forEach(category => {

        const card = document.createElement("div");

        card.className = "category-card dynamic-category-card";

        card.innerHTML = `
            <div class="category-icon">${category.icon || "🛒"}</div>
            <h3>${category.name}</h3>
            <p>${category.bengali || ""}</p>
        `;

        card.onclick = function () {
            filterProducts(category.name);
        };

        container.appendChild(card);
    });
}


// ===============================
// PRODUCT RENDER
// ===============================

function renderProducts(productList = getProducts()) {

    const container = document.querySelector("#products > div");

    if (!container) {
        return;
    }

    // --------------------------------
    // IMPORTANT:
    // Before Admin Panel is used,
    // products already exist in index.html.
    // So DO NOT create duplicate products.
    // --------------------------------

    if (localStorage.getItem("groceryProducts") === null) {

        const staticCards = container.querySelectorAll(".product-card");

        staticCards.forEach((card, index) => {

            const defaultProduct = defaultProducts[index];

            if (!defaultProduct) {
                card.style.display = "none";
                return;
            }

            const shouldShow = productList.some(
                p => Number(p.id) === Number(defaultProduct.id)
            );

            card.style.display = shouldShow ? "" : "none";
        });

        return;
    }


    // --------------------------------
    // ADMIN DATA EXISTS
    // Now use dynamic products.
    // --------------------------------

    container.innerHTML = "";

    productList.forEach(product => {

        const card = document.createElement("div");

        card.className = "product-card dynamic-product-card";

        card.setAttribute(
            "data-category",
            product.category
        );

        card.innerHTML = `
            <img src="${product.image}" alt="${product.name}">

            <h3>${product.name}</h3>

            <p>${product.quantity}</p>

            <strong>₹${product.price}</strong>

            <button
                type="button"
                onclick="addToCart(${product.id})"
                ${product.available === false ? "disabled" : ""}
            >
                ${product.available === false ? "Out of Stock" : "Add to Cart"}
            </button>
        `;

        container.appendChild(card);
    });
}


// ===============================
// FILTER PRODUCTS
// ===============================

function filterProducts(category) {

    const products = getProducts();

    const filteredProducts = products.filter(
        product =>
            product.category.toLowerCase() ===
            category.toLowerCase()
    );

    renderProducts(filteredProducts);

    document.getElementById("products")?.scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// SHOW ALL PRODUCTS
// ===============================

function showAllProducts() {

    renderProducts(getProducts());

    document.getElementById("products")?.scrollIntoView({
        behavior: "smooth"
    });
}


// ===============================
// SEARCH PRODUCTS
// ===============================

function searchProduct() {

    const searchInput = document.getElementById("searchInput");

    if (!searchInput) {
        return;
    }

    const text = searchInput.value.trim().toLowerCase();

    const products = getProducts();

    const results = products.filter(product =>
        product.name.toLowerCase().includes(text) ||
        product.category.toLowerCase().includes(text)
    );

    renderProducts(results);
}


// ===============================
// OFFERS
// ===============================

function renderOffers() {

    const offerList = document.getElementById("offerList");

    if (!offerList) {
        return;
    }

    const offers = getOffers();

    offerList.innerHTML = "";

    const activeOffers = offers.filter(
        offer => offer.active !== false
    );

    if (activeOffers.length === 0) {
        offerList.innerHTML = "";
        return;
    }

    activeOffers.forEach(offer => {

        const card = document.createElement("div");

        card.className = "offer-card";

        card.innerHTML = `
            <h3>${offer.title || "Special Offer"}</h3>

            <p>${offer.description || ""}</p>

            <div>
                <del>₹${offer.oldPrice || ""}</del>
                <strong>₹${offer.offerPrice}</strong>
            </div>
        `;

        offerList.appendChild(card);
    });
}


// ===============================
// VIEW OFFERS
// ===============================

function viewOffers() {

    const offerList = document.getElementById("offerList");

    if (!offerList) {
        return;
    }

    if (
        offerList.style.display === "none" ||
        offerList.style.display === ""
    ) {
        offerList.style.display = "block";
        renderOffers();
    } else {
        offerList.style.display = "none";
    }
}


// ===============================
// HERO SLIDER
// ===============================

let currentSlide = 0;

function startSlider() {

    const slides = document.querySelectorAll(".hero-slide");

    if (slides.length === 0) {
        return;
    }

    slides.forEach((slide, index) => {
        slide.style.display =
            index === 0 ? "block" : "none";
    });

    setInterval(() => {

        slides[currentSlide].style.display = "none";

        currentSlide++;

        if (currentSlide >= slides.length) {
            currentSlide = 0;
        }

        slides[currentSlide].style.display = "block";

    }, 4000);
}


// ===============================
// PAGE LOAD
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    renderCategories();

    renderProducts();

    renderOffers();

    updateCartCount();

    startSlider();

});