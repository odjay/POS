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
        li.textContent = `${item.name} x${item.quantity} - ${item.price * item.quantity} CHF`;
        basketElement.appendChild(li);
        total += item.price * item.quantity;
    });
    document.getElementById('total').textContent = total;
    document.getElementById('total-to-pay').textContent = total;
    updateChangeAmount();
}

// Function to update change amount
function updateChangeAmount() {
    let paymentAmount = parseFloat(document.getElementById('custom-amount').value) || 0;
    let changeAmount = paymentAmount - total;
    document.getElementById('change-amount').textContent = changeAmount > 0 ? changeAmount.toFixed(2) : '0';
}

// Function to handle payment
function handlePayment(amount) {
    console.log(`Handling payment: ${amount} CHF`);
    if (amount >= total) {
        let change = amount - total;
        // Log the transaction
        logTransaction();
        // Reset the basket
        basket = [];
        updateBasket();
        // Reset the custom amount input
        document.getElementById('custom-amount').value = '';
        updateChangeAmount();
        // The alert has been removed from here
    } else {
        alert('Montant insuffisant!');
    }
}

console.log("Script execution completed");
