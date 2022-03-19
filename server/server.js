const express = require('express')
let cors = require('cors')
let util = require('./util')

const config = require('./config.json')
const app = express()
const port = 8080
let logger;


app.use(cors())
app.use(express.json());
app.use("/", express.static("../build"))

app.listen(port, '0.0.0.0', () => {
    console.log(`Server run on ${port}`)
    init()
})



function init() {
    util.init()
    util.log()
    logger = setInterval(() => { util.log() }, 1000 * 60 * config.loggingInterval)
}



app.post('/', (req, res) => {
    let device = {
        mac: req.body.mac,
        data: new Date(),
        sensors: req.body.sensors,
    }
    if (!util.checkDeviceMac(device.mac)) {
        console.log("New device: " + device.mac)
        util.logCurent(device);
        util.log(device.mac);
    } else {
        util.logCurent(device);
    }
    res.sendStatus(200);
})

app.get('/get', (req, res) => {
    let mac = req.query.mac;
    res.send(util.getLog(mac));
})

app.get('/getName', (req, res) => {
    let mac = req.query.mac;
    let name = util.getName(mac);
    if (name) {
        res.send(name);
    } else {
        res.sendStatus(404);
    }
})

app.get('/getCurrent', (req, res) => {
    let output = util.getLastLog(true);
    if (output) {
        res.send(output);
    } else {
        res.send([]);
    }
})

app.get('/changeName', (req, res) => {
    let name = req.query.name;
    let mac = req.query.mac;
    if (name && mac) {
        let result = util.changeName(mac, name);
        res.send(result);
    }
})

app.get('/removeDevice', (req, res) => {
    let mac = req.query.mac;
    if (mac) {
        let result = util.removeDevice(mac);
        res.send(result);
    }
})


