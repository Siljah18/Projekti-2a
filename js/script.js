
// Hae HTML elementit
const productList = document.getElementById("productList");
const categorySelect = document.getElementById("categorySelect");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const minPrice = document.getElementById("minPrice");
const maxPrice = document.getElementById("maxPrice");
const priceButton = document.getElementById("priceButton");

// Tallennetaan haetut tuotteet API:sta
let allProducts = [];

// Haetaan tuotteet Fake Store API:sta
fetch("https://fakestoreapi.com/products")
    .then(response => {
        if (!response.ok) {
            throw new Error("Could not load products");
        }
        return response.json();
    })
    .then(data => {
        // Tallenna tuotteet muuttujaan
        allProducts = data;

        // Hae tuoteryhmät
        const categories = [...new Set(data.map(product => product.category))];

        // tuoteryhmät lisätään valintalistaan
        categories.forEach(category => {
            const option = document.createElement("option");
            option.value = category;
            option.textContent = category;
            categorySelect.appendChild(option);
        });

        // Näytä tuotteet
        displayProducts(allProducts);
    })
    .catch(error => {
        productList.textContent = "Could not load products. Please try again.";
        console.log("Error:", error);
    });

// Näytä tuotteet sivulla
function displayProducts(products) {
    productList.innerHTML = "";

    products.forEach(product => {
        // Luo kortti
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");
        // Luo kuva
        const image = document.createElement("img");
        image.src = product.image;
        image.alt = product.title;
        // Lisää nimi, hinta ja kategoria
        const title = document.createElement("h3");
        title.textContent = product.title;

        const price = document.createElement("p");
        price.textContent = "$" + product.price;

        const category = document.createElement("p");
        category.textContent = product.category;
        // Lisää korttiin
        productCard.appendChild(image);
        productCard.appendChild(title);
        productCard.appendChild(price);
        productCard.appendChild(category);
        // Lisää kortti sivulle
        productList.appendChild(productCard);
    });
}

// Haun suoritus hakupainikkeella
searchButton.addEventListener("click", function() {
    filterProducts();
});

// Tuotteiden suodatus kategorian vaihtuessa
categorySelect.addEventListener("change", function() {
    filterProducts();
});
// Hinnan suodatus kun suodatuspainiketta klikataan
priceButton.addEventListener("click", function() {
    filterProducts();
});

// Hae ja suodata tuotteet
function filterProducts() {
    const searchText = searchInput.value.toLowerCase();
    const selectedCategory = categorySelect.value;

    const min = minPrice.value === "" ? 0 : Number(minPrice.value);
    const max = maxPrice.value === "" ? Infinity : Number(maxPrice.value);

    const filteredProducts = allProducts.filter(product => {
        const matchesName = product.title.toLowerCase().includes(searchText);
        const matchesCategory = selectedCategory === "" || product.category === selectedCategory;
        const matchesPrice = product.price >= min && product.price <= max;

        return matchesName && matchesCategory && matchesPrice;
    });
    // Näytä suodatetut tuotteet
    displayProducts(filteredProducts);
}