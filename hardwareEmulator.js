let fetch = require('node-fetch');

function getRandom() {
    return Math.floor(Math.random() * (100 - 1 + 1)) + 1;
}

function send() {
    let data = {
        mac: "00:00:00:00:00:01",
        sensors: {
            humidity: getRandom(),
            temperature: getRandom(),
        }
    }
    fetch('http://localhost:8080/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    console.log("Inviato")
} setInterval(send, 200)