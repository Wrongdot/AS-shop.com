// Updated product array with discount field
const products = [
    { id: 1, name: "Laptop", price: 55000, discount: 10, image: "images/product1.jpg" },
    { id: 2, name: "Smartphone", price: 25000, discount: 15, image: "images/product2.jpg" },
    { id: 3, name: "Headphones", price: 2000, discount: 5, image: "images/product3.jpg" },
];

// Cart data
let cart = [];

// Wishlist data
let wishlist = [];

// Function to calculate discounted price
const calculateDiscountedPrice = (price, discount) => {
    return price - (price * (discount / 100));
};

// Function to render products to the page
const renderProducts = (filteredProducts = products) => {
    const productList = document.getElementById('product-list');
    if (!productList) return;

    productList.innerHTML = ''; // Clear existing content

    if (filteredProducts.length === 0) {
        productList.innerHTML = `<p class="no-products">No products found.</p>`;
        return;
    }

    filteredProducts.forEach(product => {
        const discountedPrice = calculateDiscountedPrice(product.price, product.discount);

        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        productDiv.innerHTML = `
            <div class="product-card">
                <a href="product${product.id}.html" class="product-link">
                    <img src="${product.image}" alt="${product.name}" class="product-image">
                    <h3>${product.name}</h3>
                    <p>
                        Price: <span class="original-price">Rs ${product.price}</span> 
                        <span class="discounted-price">Rs ${discountedPrice.toFixed(2)}</span>
                    </p>
                    ${product.discount > 0 ? `<span class="discount-badge">-${product.discount}%</span>` : ''}
                </a>
                <button class="btn add-to-cart" data-id="${product.id}"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button class="btn add-to-wishlist" data-id="${product.id}"><i class="fas fa-heart"></i> Add to Wishlist</button>
            </div>
        `;

        productList.appendChild(productDiv);
    });
};

// Function to update the cart display
const updateCartDisplay = () => {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.length;
    }

    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');

    if (cartItemsContainer && cartTotal) {
        cartItemsContainer.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>Price: Rs ${item.price.toFixed(2)}</p>
                    <p>Quantity: ${item.quantity}</p>
                    <button class="btn remove-item" data-id="${item.id}">Remove</button>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
        cartTotal.innerText = `Total: Rs ${total.toFixed(2)}`;
    }

    // Toggle cart overlay based on cart length
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        if (cart.length > 0) {
            cartOverlay.classList.add('open');
        } else {
            cartOverlay.classList.remove('open');
        }
    }
};

// Handle Add to Cart
const addToCart = (id) => {
    const product = products.find(p => p.id === parseInt(id));
    if (!product) return;

    const discountedPrice = calculateDiscountedPrice(product.price, product.discount);
    const existingItem = cart.find(item => item.id === product.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, price: discountedPrice, quantity: 1 });
    }

    updateCartDisplay();

    // Add animation to the cart count
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.classList.add('animate');
        setTimeout(() => {
            cartCount.classList.remove('animate');
        }, 300);
    }

    alert(`${product.name} has been added to your cart!`);
};

// Handle Remove from Cart
const removeFromCart = (id) => {
    cart = cart.filter(item => item.id !== parseInt(id));
    updateCartDisplay();
};

// Clear Cart
const clearCart = () => {
    cart = [];
    updateCartDisplay();
    alert('Your cart has been cleared!');
};

// Add to Wishlist
const addToWishlist = (id) => {
    const product = products.find(p => p.id === parseInt(id));
    if (product && !wishlist.includes(product)) {
        wishlist.push(product);
        alert(`${product.name} added to wishlist!`);
    }
};

// Close cart overlay
const closeCart = () => {
    const cartOverlay = document.getElementById('cart-overlay');
    if (cartOverlay) {
        cartOverlay.classList.remove('open');
    }
};

// Event listeners for search and filter
const searchBar = document.getElementById('search-bar');
if (searchBar) {
    searchBar.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const filteredProducts = products.filter(product =>
            product.name.toLowerCase().includes(query)
        );
        renderProducts(filteredProducts);
    });
}

const filterButton = document.getElementById('filter-button');
if (filterButton) {
    filterButton.addEventListener('click', () => {
        const minPrice = parseFloat(document.getElementById('min-price').value) || 0;
        const maxPrice = parseFloat(document.getElementById('max-price').value) || Infinity;

        const filteredProducts = products.filter(product =>
            product.price >= minPrice && product.price <= maxPrice
        );
        renderProducts(filteredProducts);
    });
}

// Add event listeners for Add to Cart, Wishlist, and Remove from Cart
document.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('add-to-cart')) {
        const productId = e.target.getAttribute('data-id');
        addToCart(productId);
    }

    if (e.target && e.target.classList.contains('add-to-wishlist')) {
        const productId = e.target.getAttribute('data-id');
        addToWishlist(productId);
    }

    if (e.target && e.target.classList.contains('remove-item')) {
        const productId = e.target.getAttribute('data-id');
        removeFromCart(productId);
    }

    if (e.target && e.target.id === 'clear-cart') {
        clearCart();
    }
});

// Attach close cart functionality
const closeCartButton = document.getElementById('close-cart');
if (closeCartButton) {
    closeCartButton.addEventListener('click', closeCart);
}

// Initialize the app
const init = () => {
    renderProducts();

    // Add a "Clear Cart" button dynamically (if it doesn't already exist)
    const cartContainer = document.querySelector('.cart-container');
    if (cartContainer && !document.getElementById('clear-cart')) {
        const clearCartButton = document.createElement('button');
        clearCartButton.id = 'clear-cart';
        clearCartButton.className = 'btn';
        clearCartButton.innerText = 'Clear Cart';
        clearCartButton.style.backgroundColor = '#f44336';
        clearCartButton.style.marginTop = '10px';
        cartContainer.appendChild(clearCartButton);
    }
};

init();

// Toggle cart overlay
const cartButton = document.getElementById('cart-button');
if (cartButton) {
    cartButton.addEventListener('click', () => {
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.add('open');
        }
    });
}

const closeCartBtn = document.getElementById('close-cart');
if (closeCartBtn) {
    closeCartBtn.addEventListener('click', () => {
        const cartOverlay = document.getElementById('cart-overlay');
        if (cartOverlay) {
            cartOverlay.classList.remove('open');
        }
    });
}