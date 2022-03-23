let fs = require('fs');
let Database = require('./db');
const config = require('./config.json');

class Util {
    /**
     * Metodo che inizializza il database
     * @returns 
     */
    static init() {
        Database.init();
        return Database.getLastCurrentLog();
    }

    /**
     * Metodo che ritorna i gli ultimi log di tutti i dispositivi
     * @param {*} name 
     * @returns 
     */
    static getLastLog(name = false) {
        let output = Database.getLastCurrentLog();
        if (output) {
            if (name) {
                try {
                    for (let i = 0; i < output.length; i++) {
                        output[i].name = Util.getName(output[i].mac);
                    }
                } catch (e) {
                    console.log(e);
                    return false;
                }
                return output;
            }
            return output;
        }
    }

    /**
     * Metodo che controlla se un dispositivo è già presente
     * @param {*} mac 
     * @returns 
     */
    static checkDeviceMac(mac) {
        let deviceMac = Database.getName(mac);
        if (deviceMac) {
            return true;
        } else {
            Database.insertMac(mac, config.defaultDeviceName);
            return false;
        }
    }

    /**
     * Metodo che ritorna il nome di un dispositivo
     * @param {*} mac 
     * @returns 
     */
    static getName(mac) {
        return Database.getName(mac).name;
    }

    /**
     * Metodo che cambia il nome di un dispositivo
     * @param {*} mac 
     * @param {*} name 
     * @returns 
     */
    static changeName(mac, name) {
        if (Database.updateName(mac, name)) {
            return true;
        }
        return false;
    }

    /**
     * Metodo che elimina un dispositivo
     * @param {*} mac 
     * @returns 
     */
    static removeDevice(mac) {
        if (Database.removeMac(mac)) {
            return true;
        }
        return false;
    }

    /**
     * Metodo che logga le informazioni di un dispositivo
     * @param {*} device 
     * @param {*} force logga in modo forzato
     */
    static logCurent(device) {
        Database.updateCurrentLog(device.mac, device.sensors.temperature, device.sensors.humidity, new Date());
    }

    static log(mac = null) {
        let devices = Database.getLastCurrentLog(mac);
        if (devices) {
            for (let i = 0; i < devices.length; i++) {
                let device = devices[i];
                let lastLog = Database.getLastLog(device.mac);
                if (lastLog) {
                    let lastLogDate = new Date(lastLog.date);
                    let currentLogDate = new Date(device.date);
                    if (!Util.compereDate(lastLogDate, currentLogDate)) {
                        console.log("Inserimento nuovi log database");
                        Database.insertLog(device.mac, device.temperature, device.humidity, new Date(device.date));
                    }
                }else{
                    console.log("Inserimento nuovi log database");
                    Database.insertLog(device.mac, device.temperature, device.humidity, new Date(device.date));
                }
            }
        }
    }

    static compereDate(date1, date2) {
        let d1 = new Date(date1);
        let d2 = new Date(date2);
        return (d1.getTime() === d2.getTime())
    }

    /*CHART METHODS */
    /**
     * Metodo che ritorna i log di un dispositivo
     * @param {*} mac 
     * @returns 
     */
     static getChartData(mac) {
        return Database.getLog(mac);
    }
}
module.exports = Util;