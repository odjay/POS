console.log("Script loaded");

// ... (all other functions remain the same)

// Function to log transaction to IFTTT
async function logTransactionToIFTTT(transaction) {
    const event = 'POS'; // Replace with your IFTTT event name
    const key = 'x5Jhxl9evk6SPmKe8rW5S'; // Replace with your IFTTT Webhook key

    const payload = {
        value1: transaction.items,
        value2: `Total: ${transaction.total} CHF, Paid: ${transaction.paid} CHF, Change: ${transaction.change} CHF`,
        value3: transaction.date
    };

    console.log('Sending to IFTTT:', payload);

    try {
        const response = await fetch(`https://maker.ifttt.com/trigger/${event}/with/key/${key}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (response.ok) {
            const responseText = await response.text();
            console.log('IFTTT Response:', responseText);
            console.log('Transaction logged to IFTTT successfully');
        } else {
            console.error('Failed to log transaction to IFTTT. Status:', response.status);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error sending request to IFTTT:', error);
    }
}

// ... (all other event listeners and code remain the same)

console.log("Script execution completed");
