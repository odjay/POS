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
    let paymentAmount = parseFloat(document.getElementById('custom-amount').value) || 0;
    let changeAmount = paymentAmount - total;
    document.getElementById('change-amount').textContent = changeAmount > 0 ? changeAmount.toFixed(2) : '0.00';
}

// Function to handle payment
function handlePayment(amount) {
    console.log(`Handling payment: ${amount} CHF`);
    if (amount >= total) {
        let change = amount - total;
        console.log(`Change to be returned: ${change} CHF`);
        document.getElementById('change-amount').textContent = change.toFixed(2);
        // Log the transaction
        let transaction = {
            items: basket,
            total: total,
            paid: amount,
            date: new Date().toISOString()
        };
        logTransactionToIFTTT(transaction);
        // Reset the basket
        basket = [];
        updateBasket();
        // Reset the custom amount input
        document.getElementById('custom-amount').value = '';
        alert(`Payment successful. Change: ${change.toFixed(2)} CHF`);
    } else {
        alert('Montant insuffisant!');
    }
}

// Function to log transaction to IFTTT
async function logTransactionToIFTTT(transaction) {
    const event = 'POS'; // Replace with your IFTTT event name
    const key = 'x5Jhxl9evk6SPmKe8rW5S'; // Replace with your IFTTT Webhook key

    const response = await fetch(`https://maker.ifttt.com/trigger/${event}/with/key/${key}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            value1: JSON.stringify(transaction.items),
            value2: transaction.total.toFixed(2),
            value3: transaction.paid.toFixed(2)
        })
    });

    if (response.ok) {
        console.log('Transaction logged to IFTTT');
    } else {
        console.error('Failed to log transaction to IFTTT');
    }
}

// Add event listeners when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
    console.log("DOM fully loaded and parsed");

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
            document.getElementById('custom-amount').value = amount;
            updateChangeAmount();
            handlePayment(amount);
        });
    });

    // Add event listener to custom amount input
    document.getElementById('custom-amount').addEventListener('input', updateChangeAmount);

    // Add event listener to custom payment button
    document.getElementById('pay-custom').addEventListener('click', function() {
        let amount = parseFloat(document.getElementById('custom-amount').value);
        if (isNaN(amount)) {
            alert('Veuillez entrer un montant valide');
        } else {
            handlePayment(amount);
        }
    });

    // Add event listener for remove buttons (using event delegation)
    document.getElementById('basket-items').addEventListener('click', function(e) {
        if (e.target.classList.contains('remove-item')) {
            let name = e.target.getAttribute('data-name');
            removeFromBasket(name);
        }
    });
});

console.log("Script execution completed");
