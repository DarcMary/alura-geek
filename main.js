const productsContainer = document.getElementById('products');
const noProductsMessage = document.getElementById('no-products');
const imageInput = document.getElementById('image');
const imagePreview = document.getElementById('image-preview');
const errorMessage = document.getElementById('error-message');
const mobileForm = document.getElementById('mobile-form');
const mobileImageInput = document.getElementById('mobile-image');
const mobileImagePreview = document.getElementById('mobile-image-preview');
const mobileErrorMessage = document.getElementById('mobile-error-message');

// Function to toggle mobile form
function toggleMobileForm() {
    mobileForm.classList.toggle('hidden');
}

// Fetch and display products
async function fetchProducts() {
    const response = await fetch('http://localhost:3000/products');
    const products = await response.json();
    displayProducts(products);
}

function displayProducts(products) {
    productsContainer.innerHTML = '';
    if (products.length === 0) {
        noProductsMessage.classList.remove('hidden');
    } else {
        noProductsMessage.classList.add('hidden');
        products.forEach(product => {
            const productCard = `
                <div class="border p-4 rounded flex flex-col justify-between">
                    <img src="${product.image}" alt="${product.name}" class="w-full h-32 object-cover mb-4">
                    <h3 class="text-lg font-semibold mb-2">${product.name}</h3>
                    <div class="flex justify-between items-center">
                        <p class="text-gray-600 mb-2">$${product.price}</p>
                        <button class="delete-btn" onclick="deleteProduct('${product.id}')">
                            <svg fill="#e70202" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 26 26">
                                <path d="M 11 -0.03125 C 10.164063 -0.03125 9.34375 0.132813 8.75 0.71875 C 8.15625 1.304688 7.96875 2.136719 7.96875 3 L 4 3 C 3.449219 3 3 3.449219 3 4 L 2 4 L 2 6 L 24 6 L 24 4 L 23 4 C 23 3.449219 22.550781 3 22 3 L 18.03125 3 C 18.03125 2.136719 17.84375 1.304688 17.25 0.71875 C 16.65625 0.132813 15.835938 -0.03125 15 -0.03125 Z M 11 2.03125 L 15 2.03125 C 15.546875 2.03125 15.71875 2.160156 15.78125 2.21875 C 15.84375 2.277344 15.96875 2.441406 15.96875 3 L 10.03125 3 C 10.03125 2.441406 10.15625 2.277344 10.21875 2.21875 C 10.28125 2.160156 10.453125 2.03125 11 2.03125 Z M 4 7 L 4 23 C 4 24.652344 5.347656 26 7 26 L 19 26 C 20.652344 26 22 24.652344 22 23 L 22 7 Z M 8 10 L 10 10 L 10 22 L 8 22 Z M 12 10 L 14 10 L 14 22 L 12 22 Z M 16 10 L 18 10 L 18 22 L 16 22 Z"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            `;
            productsContainer.innerHTML += productCard;
        });
    }
}

// Preview image (Desktop)
imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            imagePreview.src = e.target.result;
            imagePreview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    } else {
        imagePreview.classList.add('hidden');
    }
});

// Preview image (Mobile)
mobileImageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            mobileImagePreview.src = e.target.result;
            mobileImagePreview.classList.remove('hidden');
        }
        reader.readAsDataURL(file);
    } else {
        mobileImagePreview.classList.add('hidden');
    }
});

// Add new product (Desktop)
const addProductForm = document.getElementById('add-product-form');
addProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const imageFile = document.getElementById('image').files[0];

    if (!name || !price || !imageFile) {
        errorMessage.classList.remove('hidden');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
        const newProduct = {
            id: Math.random().toString(36).substring(2, 6), // generate a 4-character string ID
            name: name,
            price: parseFloat(price).toFixed(2),
            image: reader.result
        };

        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        const addedProduct = await response.json();
        fetchProducts();
        addProductForm.reset();
        imagePreview.classList.add('hidden');
        errorMessage.classList.add('hidden');
    }

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
});

// Add new product (Mobile)
const mobileAddProductForm = document.getElementById('mobile-add-product-form');
mobileAddProductForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('mobile-name').value;
    const price = document.getElementById('mobile-price').value;
    const imageFile = document.getElementById('mobile-image').files[0];

    if (!name || !price || !imageFile) {
        mobileErrorMessage.classList.remove('hidden');
        return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
        const newProduct = {
            id: Math.random().toString(36).substring(2, 6), // generate a 4-character string ID
            name: name,
            price: parseFloat(price).toFixed(2),
            image: reader.result
        };

        const response = await fetch('http://localhost:3000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        const addedProduct = await response.json();
        fetchProducts();
        mobileAddProductForm.reset();
        mobileImagePreview.classList.add('hidden');
        mobileErrorMessage.classList.add('hidden');
        toggleMobileForm();
    }

    if (imageFile) {
        reader.readAsDataURL(imageFile);
    }
});

// Delete product
async function deleteProduct(id) {
    await fetch(`http://localhost:3000/products/${id}`, {
        method: 'DELETE'
    });
    fetchProducts();
}

// Initial fetch
fetchProducts();
