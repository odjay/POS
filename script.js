// Initialize the basket and total
let basket = [];
let total = 0;

// Function to add item to basket
function addToBasket(name, price) {
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
}

// Function to handle payment
function handlePayment(amount) {
    if (amount >= total) {
        // Log the transaction
        logTransaction();
        // Reset the basket
        basket = [];
        updateBasket();
        alert('Paiement effectué avec succès!');
    } else {
        alert('Montant insuffisant!');
    }
}

// Function to log the transaction
function logTransaction() {
    let transaction = {
        items: basket,
        total: total,
        date: new Date().toISOString()
    };
    // Here you would typically send this data to a server
    console.log('Transaction logged:', transaction);
}

// Add event listeners to menu items
document.querySelectorAll('.menu-item').forEach(button => {
    button.addEventListener('click', function() {
        let name = this.getAttribute('data-name');
        let price = parseFloat(this.getAttribute('data-price'));
        addToBasket(name, price);
    });
});

// Add event listeners to payment buttons
document.querySelectorAll('.pay-button').forEach(button => {
    button.addEventListener('click', function() {
        let amount = parseFloat(this.getAttribute('data-amount'));
        handlePayment(amount);
    });
});

// Add event listener to custom payment button
document.getElementById('pay-custom').addEventListener('click', function() {
    let amount = parseFloat(document.getElementById('custom-amount').value);
    if (isNaN(amount)) {
        alert('Veuillez entrer un montant valide');
    } else {
        handlePayment(amount);
    }
});
