const config = require('./config.json');
const db = require('better-sqlite3')(config.database);


/**
 * Classe Database per gestire il database in sqlite 3
 */
class Database {
    /**
     * Metodo che crea il database
     */
    static init() {
        db.prepare('CREATE TABLE IF NOT EXISTS devices (mac TEXT PRIMARY KEY, name TEXT)').run();
        db.prepare('CREATE TABLE IF NOT EXISTS devicesLog (id INTEGER PRIMARY KEY AUTOINCREMENT, mac TEXT,temperature INTEGER, humidity INTEGER,date TEXT,FOREIGN KEY(mac) REFERENCES devices(mac))').run();
        db.prepare('CREATE TABLE IF NOT EXISTS devicesCurrentLog (mac TEXT PRIMARY KEY,temperature INTEGER, humidity INTEGER,date TEXT,FOREIGN KEY(mac) REFERENCES devices(mac))').run();
    }

    /**
     * Metodo che aggiorna il nome di un dispositivo
     * @param {*} mac il mac del dispositivo
     * @param {*} name il nuovo nome
     * @returns true o false
     */
    static updateName(mac, name) {
        return db.prepare('UPDATE devices SET name = ? WHERE mac = ?').run(name, mac);
    }

    /**
     * Metodo che inserisce un nuovo log
     * @param {*} mac il mac del dispositivo
     * @param {*} temperature la temperatura
     * @param {*} humidity l'umidità
     * @param {*} date la data
     * @returns true o false
     */
    static insertLog(mac, temperature, humidity, date) {
        let result = db.prepare('INSERT INTO devicesLog (mac, temperature, humidity, date) VALUES (?, ?, ?, ?)').run(mac, temperature, humidity, date.toString());
    
        return result.changes > 0;
    }

    static updateCurrentLog(mac, temperature, humidity, date) {
        let result;
        if (db.prepare('SELECT * FROM devicesCurrentLog WHERE mac = ?').all(mac).length == 0) {
            result = db.prepare('INSERT INTO devicesCurrentLog (mac, temperature, humidity, date) VALUES (?, ?, ?, ?)').run(mac, temperature, humidity, date.toString());
        }
        result = db.prepare('UPDATE devicesCurrentLog SET temperature = ?, humidity = ?, date = ? WHERE mac = ?').run(temperature, humidity, date.toString(), mac);
        return result.changes > 0;
    }

    /**
     * Metodo che inserisce un nuovo dispositivo
     * @param {*} mac 
     * @param {*} name 
     * @returns 
     */
    static insertMac(mac, name) {
        let result = db.prepare('INSERT INTO devices (mac, name) VALUES (?, ?)').run(mac, name);
        return result.changes > 0;
    }

    /**
     * Metodo che elimina un dispositivo
     * @param {*} mac 
     * @returns 
     */
    static removeMac(mac) {
        db.prepare('DELETE FROM devicesLog WHERE mac = ?').run(mac);
        return db.prepare('DELETE FROM devices WHERE mac = ?').run(mac);
    }

    /**
     * Metodo che ritrona il nome di un dispositivo
     * @param {*} mac 
     * @returns 
     */
    static getName(mac) {
        return db.prepare('SELECT name FROM devices WHERE mac = ?').get(mac);
    }

    /**
     * Metodo che ritorna tutti i dispositivi oopure solo di un despositivo
     * @param {*} mac 
     * @returns 
     */
    static getLog(mac = null) {
        if (mac) {
            return db.prepare('SELECT * FROM devicesLog WHERE mac = ?').all(mac);
        }
        return db.prepare('SELECT * FROM devicesLog').all();
    }

    static getLastLog(mac) {
        return db.prepare('SELECT * FROM devicesLog WHERE mac = ? order by ID desc limit 1').get(mac);
    }
    /**
     * Metodo che ritorna l'ultimo log di un dispositivo o tutti
     * @param {*} mac 
     * @returns 
     */
    static getLastCurrentLog(mac = null) {
        if (mac) {
            return db.prepare('SELECT * FROM devicesCurrentLog WHERE mac = ?').all(mac);
        }
        return db.prepare('SELECT * FROM devicesCurrentLog').all();
    }
}
module.exports = Database;