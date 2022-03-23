let fetch = require('node-fetch');

function getRandomNumber(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

let humidity = 20;
let temperature = 20;

function send() {
    humidity += getRandomNumber(-3,3);
    if(humidity > 100)humidity = 100;
    if(humidity < 0)humidity = 0;
    if(temperature >= 100)temperature = 20;
    if(temperature <= 0)temperature = 20;
    temperature += getRandomNumber(-3,3);
    let data = {
        mac: "00:00:00:00:00:00",
        sensors: {
            humidity: humidity,
            temperature: temperature,
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
} setInterval(send, 200);