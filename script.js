console.log("Script loaded");

// Initialize the basket and total
let basket = [];
let total = 0;

// Function to add item to basket
function addToBasket(name, price) {
    console.log(`Adding to basket: ${name} - ${price} CHF`);
    let item = basket.find(i => i.name === name);
    if (item) {
        item.quantity++;
    } else {
        basket.push({name: name, price: price, quantity: 1});
    }
    console.log("Basket after adding item:", basket);
    updateBasket();
}

// Function to remove item from basket
function removeFromBasket(name) {
    console.log(`Removing from basket: ${name}`);
    let itemIndex = basket.findIndex(i => i.name === name);
    if (itemIndex !== -1) {
        basket[itemIndex].quantity--;
        if (basket[itemIndex].quantity === 0) {
            basket.splice(itemIndex, 1);
        }
    }
    console.log("Basket after removing item:", basket);
    updateBasket();
}

// Function to update the basket display
function updateBasket() {
    console.log("Updating basket");
    let basketElement = document.getElementById('basket-items');
    basketElement.innerHTML = '';
    total = 0;
    basket.forEach(item => {
        let li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} x${item.quantity} - ${(item.price * item.quantity).toFixed(2)} CHF</span>
            <button class="remove-item" data-name="${item.name}">X</button>
        `;
        basketElement.appendChild(li);
        total += item.price * item.quantity;
    });
    document.getElementById('total').textContent = total.toFixed(2);
    document.getElementById('total-to-pay').textContent = total.toFixed(2);
    updateChangeAmount();
}

// Function to update change amount
function updateChangeAmount() {
