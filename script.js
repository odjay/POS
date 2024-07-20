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
        let transaction = {
            items: basket,
            total: total,
            date: new Date().toISOString()
        };
        logTransactionToIFTTT(transaction); // Call the IFTTT logging function
        // Reset the basket
        basket = [];
        updateBasket();
        // Reset the custom amount input
        document.getElementById('custom-amount').value = '';
        updateChangeAmount();
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
            value2: transaction.total,
            value3: transaction.date
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
            handlePayment(amount); // Automatically handle payment without confirmation
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
});

console.log("Script execution completed");
