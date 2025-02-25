document.addEventListener("DOMContentLoaded", () => {
    const products = [
        { id: 1, name: "Laptop", price: "55000", image: "images/product1.jpg" },
        { id: 2, name: "Smartphone", price: "25000", image: "images/product2.jpg" },
        { id: 3, name: "Headphones", price: "2000", image: "images/product3.jpg" },
        { id: 4, name: "Smartwatch", price: "5000", image: "images/product4.jpg" },
        { id: 5, name: "Tablet", price: "30000", image: "images/product5.jpg" },
        { id: 6, name: "Gaming Console", price: "40000", image: "images/product6.jpg" },
        { id: 7, name: "Camera", price: "35000", image: "images/product7.jpg" },
        { id: 8, name: "Bluetooth Speaker", price: "4000", image: "images/product8.jpg" },
        { id: 9, name: "Keyboard", price: "1200", image: "images/product9.jpg" },
        { id: 10, name: "Mouse", price: "800", image: "images/product10.jpg" },
        { id: 11, name: "Monitor", price: "15000", image: "images/product11.jpg" },
        { id: 12, name: "Printer", price: "12000", image: "images/product12.jpg" },
        { id: 13, name: "Router", price: "3000", image: "images/product13.jpg" },
        { id: 14, name: "External Hard Drive", price: "7000", image: "images/product14.jpg" },
        { id: 15, name: "Webcam", price: "2500", image: "images/product15.jpg" },
        { id: 16, name: "Power Bank", price: "1500", image: "images/product16.jpg" },
        { id: 17, name: "Earbuds", price: "3000", image: "images/product17.jpg" },
        { id: 18, name: "VR Headset", price: "45000", image: "images/product18.jpg" },
        { id: 19, name: "Portable SSD", price: "8000", image: "images/product19.jpg" },
        { id: 20, name: "Fitness Tracker", price: "4000", image: "images/product20.jpg" },
    ];

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    const productList = document.querySelector(".product-list");
    const cartItemsContainer = document.querySelector("#cart-items");
    const cartTotalContainer = document.querySelector("#cart-total");
    const cartCountContainer = document.querySelector("#cart-count");
    const cartModal = document.getElementById("cartModal");
    const closeCartButton = document.getElementById("close-cart");
    const clearCartButton = document.getElementById("clear-cart");

    if (!productList || !cartItemsContainer || !cartTotalContainer || !cartModal || !closeCartButton) {
        console.error("Essential DOM elements are missing.");
        return;
    }

    // Helper: Format Price
    function formatPrice(price) {
        return `PKR ${price.toLocaleString()}`;
    }

    // Render Products
    function renderProducts() {
        productList.innerHTML = products
            .map((product) => {
                if (!product.id || !product.name || !product.price || !product.image) {
                    console.error("Invalid product data:", product);
                    return "";
                }
                return `
                    <div class="product" aria-label="Product: ${product.name}">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='images/placeholder.jpg';">
                        <h3>${product.name}</h3>
                        <p>${formatPrice(parseFloat(product.price))}</p>
                        <button 
                            class="add-to-cart" 
                            data-id="${product.id}" 
                            data-name="${product.name}" 
                            data-price="${product.price}" 
                            aria-label="Add ${product.name} to cart"
                            tabindex="0">
                            Add to Cart
                        </button>
                    </div>
                `;
            })
            .join("");
    }

    // Update Cart Display
    function updateCartDisplay() {
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty</p>";
            cartTotalContainer.textContent = "PKR 0.00";
            cartCountContainer.textContent = "0";
        } else {
            cartItemsContainer.innerHTML = cart
                .map(
                    (item) => `
                        <div class="cart-item" aria-label="Cart Item: ${item.name}">
                            <span>${item.name} - ${formatPrice(item.price)} x ${item.quantity}</span>
                            <button class="delete-btn" data-id="${item.id}" aria-label="Remove ${item.name} from cart">Delete</button>
                        </div>
                    `
                )
                .join("");

            const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            cartTotalContainer.textContent = formatPrice(total);

            const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCountContainer.textContent = itemCount.toString();
        }
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // Add to Cart
    function addToCart(productId, productName, productPrice) {
        const existingProduct = cart.find((item) => item.id === productId);
        if (existingProduct) {
            existingProduct.quantity += 1;
        } else {
            cart.push({ id: productId, name: productName, price: parseFloat(productPrice), quantity: 1 });
        }
        updateCartDisplay();
        showNotification(`${productName} added to cart!`, "success");
    }

    // Remove from Cart
    function removeFromCart(productId) {
        const product = cart.find((item) => item.id === productId);
        if (product) {
            cart = cart.filter((item) => item.id !== productId);
            updateCartDisplay();
            showNotification(`${product.name} removed from cart!`, "error");
        }
    }

    // Show Notification
    function showNotification(message, type) {
        const notification = document.createElement("div");
        notification.classList.add("notification", type);
        notification.textContent = message;
        document.body.appendChild(notification);

        // Remove notification after 2 seconds
        setTimeout(() => {
            notification.remove();
        }, 2000);
    }

    // Toggle Cart Modal
    function toggleCartModal() {
        cartModal.classList.toggle("open");
        if (cartModal.classList.contains("open")) {
            cartModal.focus();
        }
    }

    // Event Handlers
    productList.addEventListener("click", (e) => {
        if (e.target.classList.contains("add-to-cart")) {
            const productId = parseInt(e.target.dataset.id);
            const productName = e.target.dataset.name;
            const productPrice = parseFloat(e.target.dataset.price);
            addToCart(productId, productName, productPrice);
        }
    });

    cartItemsContainer.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const productId = parseInt(e.target.dataset.id);
            const product = cart.find((item) => item.id === productId);
            if (product && confirm(`Are you sure you want to remove ${product.name} from the cart?`)) {
                removeFromCart(productId);
            }
        }
    });

    document.querySelector(".cart a").addEventListener("click", (e) => {
        e.preventDefault();
        toggleCartModal();
    });

    closeCartButton.addEventListener("click", () => {
        cartModal.classList.remove("open");
    });

    if (clearCartButton) {
        clearCartButton.addEventListener("click", () => {
            if (cart.length > 0 && confirm("Are you sure you want to clear your cart?")) {
                cart = [];
                updateCartDisplay();
                showNotification("Cart cleared!", "error");
            }
        });
    }

    // Add to Cart Button Animation
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            button.classList.add('added');
            setTimeout(() => {
                button.classList.remove('added');
            }, 500); // Match the animation duration
        });
    });

    // Initial Render
    renderProducts();
    updateCartDisplay();
});