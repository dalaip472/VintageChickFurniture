function searchTables() {
    let input, filter, container, items, name, i, txtValue, hasResults;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    container = document.getElementById("tableContainer");
    items = container.getElementsByClassName("table-item");
    hasResults = false; // Tracks whether any item matches the search

    for (i = 0; i < items.length; i++) {
        name = items[i].getElementsByTagName("h3")[0];
        txtValue = name.textContent || name.innerText;
        if (txtValue.toUpperCase().indexOf(filter) > -1) {
            items[i].style.display = ""; // Show matching items
            hasResults = true; // Found at least one match
        } else {
            items[i].style.display = "none"; // Hide non-matching items
        }
    }

    // Check if no results were found
    let noResultsMessage = document.getElementById("noResults");
    if (!hasResults) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement("div");
            noResultsMessage.id = "noResults";
            noResultsMessage.style.textAlign = "center";
            noResultsMessage.style.color = "#721d1d";
            noResultsMessage.style.fontWeight = "bold";
            noResultsMessage.style.marginTop = "50px";
            noResultsMessage.textContent = "No results found.";
            container.parentNode.appendChild(noResultsMessage);
        }
    } else {
        if (noResultsMessage) {
            noResultsMessage.remove(); // Remove the "No results found" message if there are results
        }
    }
}



// Initialize an empty cart
let cart = [];

// Function to search tables
function searchTables() {
    const input = document.getElementById("searchInput").value.toUpperCase();
    const items = document.querySelectorAll(".table-item");
    let hasResults = false; // Tracks if any item matches the search

    items.forEach(item => {
        const name = item.querySelector("h3").textContent.toUpperCase();
        if (name.includes(input)) {
            item.style.display = ""; // Show matching items
            hasResults = true;
        } else {
            item.style.display = "none"; // Hide non-matching items
        }
    });

    // Handle "No results found" message
    let noResultsMessage = document.getElementById("noResults");
    if (!hasResults) {
        if (!noResultsMessage) {
            noResultsMessage = createNoResultsMessage();
        }
    } else if (noResultsMessage) {
        noResultsMessage.remove(); // Remove message if results found
    }
}

function createNoResultsMessage() {
    const message = document.createElement("div");
    message.id = "noResults";
    message.style.textAlign = "center";
    message.style.color = "#721d1d";
    message.style.fontWeight = "bold";
    message.style.marginTop = "50px";
    message.textContent = "No results found.";
    document.getElementById("tableContainer").parentNode.appendChild(message);
    return message;
}

// Function to add item to cart
function addToCart(item) {
    cart.push(item);
    showNotification(`${item.name} has been added to your cart!`);
    updateCartDisplay();
}

// Function to update the cart display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById("cart-items");
    cartItemsContainer.innerHTML = ""; // Clear current cart items
    cart.forEach(item => {
        const li = document.createElement("li");
        li.innerText = `${item.name} - ${item.price}`;
        cartItemsContainer.appendChild(li);
    });
    document.getElementById("cart").style.display = cart.length ? "block" : "none"; // Show or hide cart
}

// Function to show notification
function showNotification(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerText = message;
    document.body.appendChild(notification);

    // Show notification
    setTimeout(() => notification.classList.add("show"), 10);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove("show");
        setTimeout(() => notification.remove(), 500); // Wait for fade-out before removing
    }, 3000);
}

// Add event listeners to "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach(button => {
    button.addEventListener("click", () => {
        const item = {
            name: button.parentElement.querySelector("h3").innerText,
            price: button.parentElement.querySelector("p:nth-of-type(2)").innerText,
            image: button.parentElement.querySelector("img").src
        };
        addToCart(item);
    });
});

// Function to handle checkout
function checkout() {
    if (!cart.length) {
        alert("Your cart is empty! Please add items to your cart before checking out.");
        return;
    }

    let total = 0;
    let cartSummary = "Your Cart:\n\n";

    cart.forEach(item => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, "")); // Extract numeric value
        total += price;
        cartSummary += `${item.name} - ${item.price}\n`;
    });

    cartSummary += `\nTotal: $${total.toFixed(2)}`;
    alert(cartSummary); // Show cart summary

    // Clear the cart after checkout
    cart = [];
    updateCartDisplay();
}
// Payment Dropdown Functionality
document.getElementById('paymentDropdownBtn').addEventListener('click', function() {
    document.getElementById('paymentDropdown').classList.toggle('show');
});

// Close the dropdown if clicked outside
window.addEventListener('click', function(event) {
    if (!event.target.matches('.payment-dropdown-btn') && !event.target.closest('.payment-dropdown-btn')) {
        const dropdowns = document.getElementsByClassName('payment-dropdown-content');
        for (let i = 0; i < dropdowns.length; i++) {
            const openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
});

function selectPayment(method) {
    const dropdown = document.getElementById('paymentDropdown');
    dropdown.classList.remove('show');
    
    const creditCardDetails = document.getElementById('creditCardDetails');
    const selectedPayment = document.getElementById('selectedPayment');
    
    if (method === 'creditCard') {
        selectedPayment.innerHTML = '<i class="far fa-credit-card"></i> Credit Card';
        creditCardDetails.style.display = 'block';
    } else if (method === 'paypal') {
        selectedPayment.innerHTML = '<i class="fab fa-paypal"></i> PayPal';
        creditCardDetails.style.display = 'none';
    } else if (method === 'bankTransfer') {
        selectedPayment.innerHTML = '<i class="fas fa-university"></i> Bank Transfer';
        creditCardDetails.style.display = 'none';
    }
}
// Enhanced Checkout Function
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty! Please add items first.');
        return;
    }

    // Create checkout modal
    const modal = document.createElement('div');
    modal.className = 'checkout-modal';
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    
    // Modal content
    modal.innerHTML = `
        <div class="checkout-content" style="
            background: white;
            padding: 30px;
            border-radius: 12px;
            width: 90%;
            max-width: 500px;
            max-height: 90vh;
            overflow-y: auto;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            transform: translateY(20px);
            transition: transform 0.3s ease;
        ">
            <h2 style="color: #9c135e; margin-top: 0;">Complete Your Purchase</h2>
            
            <div class="payment-dropdown">
                <button type="button" class="payment-dropdown-btn" id="paymentDropdownBtn">
                    <span id="selectedPayment">
                        <i class="far fa-credit-card"></i> Select Payment Method
                    </span>
                    <i class="fas fa-chevron-down"></i>
                </button>
                <div class="payment-dropdown-content" id="paymentDropdown">
                    <div class="payment-option credit-card" onclick="selectPayment('creditCard')">
                        <i class="far fa-credit-card"></i>
                        <span>Credit/Debit Card</span>
                    </div>
                    <div class="payment-option paypal" onclick="selectPayment('paypal')">
                        <i class="fab fa-paypal"></i>
                        <span>PayPal</span>
                    </div>
                    <div class="payment-option bank-transfer" onclick="selectPayment('bankTransfer')">
                        <i class="fas fa-university"></i>
                        <span>Bank Transfer</span>
                    </div>
                </div>
            </div>
            
            <div id="creditCardDetails" class="payment-details">
                <div class="form-group">
                    <label>Card Number</label>
                    <input type="text" placeholder="1234 5678 9012 3456" class="card-input" style="
                        padding: 12px;
                        width: 100%;
                        border: 1px solid #ddd;
                        border-radius: 6px;
                        font-size: 16px;
                    ">
                </div>
                <div style="display: flex; gap: 15px;">
                    <div class="form-group" style="flex: 1;">
                        <label>Expiry Date</label>
                        <input type="text" placeholder="MM/YY" style="
                            padding: 12px;
                            width: 100%;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            font-size: 16px;
                        ">
                    </div>
                    <div class="form-group" style="flex: 1;">
                        <label>CVV</label>
                        <input type="text" placeholder="123" style="
                            padding: 12px;
                            width: 100%;
                            border: 1px solid #ddd;
                            border-radius: 6px;
                            font-size: 16px;
                        ">
                    </div>
                </div>
            </div>
            
            <div id="orderSummary" style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 15px;">
                <h3 style="margin-bottom: 10px;">Order Summary</h3>
                <div id="checkoutItems"></div>
                <div style="font-weight: bold; text-align: right; margin-top: 15px; font-size: 18px;">
                    Total: $${calculateTotal().toFixed(2)}
                </div>
            </div>
            
            <button onclick="processPayment()" style="
                background: linear-gradient(135deg, #9c135e, #ce5792);
                color: white;
                border: none;
                padding: 15px;
                width: 100%;
                border-radius: 8px;
                font-size: 16px;
                font-weight: bold;
                margin-top: 20px;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Complete Purchase</button>
            
            <button onclick="closeCheckout()" style="
                background: transparent;
                color: #9c135e;
                border: 1px solid #9c135e;
                padding: 15px;
                width: 100%;
                border-radius: 8px;
                font-size: 16px;
                margin-top: 10px;
                cursor: pointer;
                transition: all 0.3s ease;
            ">Continue Shopping</button>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Animate modal in
    setTimeout(() => {
        modal.style.opacity = '1';
        modal.querySelector('.checkout-content').style.transform = 'translateY(0)';
    }, 10);
    
    // Populate cart items
    const checkoutItems = modal.querySelector('#checkoutItems');
    checkoutItems.innerHTML = '';
    cart.forEach(item => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        const itemElement = document.createElement('div');
        itemElement.style.display = 'flex';
        itemElement.style.justifyContent = 'space-between';
        itemElement.style.marginBottom = '8px';
        itemElement.innerHTML = `
            <span>${item.name}</span>
            <span>$${price.toFixed(2)}</span>
        `;
        checkoutItems.appendChild(itemElement);
    });
    
    // Add payment dropdown functionality
    modal.querySelector('#paymentDropdownBtn').addEventListener('click', function() {
        const dropdown = modal.querySelector('#paymentDropdown');
        dropdown.classList.toggle('show');
        this.querySelector('i').style.transform = dropdown.classList.contains('show') ? 'rotate(180deg)' : 'rotate(0)';
    });
    
    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        if (!event.target.closest('.payment-dropdown')) {
            const dropdown = modal.querySelector('#paymentDropdown');
            if (dropdown.classList.contains('show')) {
                dropdown.classList.remove('show');
                modal.querySelector('#paymentDropdownBtn i').style.transform = 'rotate(0)';
            }
        }
    });
}

function calculateTotal() {
    return cart.reduce((total, item) => {
        const price = parseFloat(item.price.replace(/[^0-9.-]+/g, ""));
        return total + price;
    }, 0);
}

function selectPayment(method) {
    const dropdown = document.querySelector('#paymentDropdown');
    dropdown.classList.remove('show');
    document.querySelector('#paymentDropdownBtn i').style.transform = 'rotate(0)';
    
    const selectedPayment = document.querySelector('#selectedPayment');
    const details = document.querySelector('#creditCardDetails');
    
    if (method === 'creditCard') {
        selectedPayment.innerHTML = '<i class="far fa-credit-card"></i> Credit/Debit Card';
        details.classList.add('show');
    } else if (method === 'paypal') {
        selectedPayment.innerHTML = '<i class="fab fa-paypal"></i> PayPal';
        details.classList.remove('show');
    } else if (method === 'bankTransfer') {
        selectedPayment.innerHTML = '<i class="fas fa-university"></i> Bank Transfer';
        details.classList.remove('show');
    }
}

function closeCheckout() {
    const modal = document.querySelector('.checkout-modal');
    modal.style.opacity = '0';
    modal.querySelector('.checkout-content').style.transform = 'translateY(20px)';
    setTimeout(() => {
        document.body.removeChild(modal);
    }, 300);
}

function processPayment() {
    const selectedPayment = document.querySelector('#selectedPayment').textContent.trim();
    if (selectedPayment.includes('Select')) {
        showNotification('Please select a payment method!');
        return;
    }
    
    // In a real app, you would process payment here
    showNotification('Payment processed successfully!');
    closeCheckout();
    
    // Clear cart
    cart = [];
    updateCartDisplay();
    document.getElementById('cart').style.display = 'none';
    
    // Show confirmation
    setTimeout(() => {
        showNotification('Your order has been placed! Thank you.');
    }, 1000);
}