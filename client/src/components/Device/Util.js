import swal from 'sweetalert';

class Util {
    static TEMP_GRADIENT = {
        gradient: [
            "#7bae37",
            "#7bae37",
            "#f6d658",
            "#ff4500"
        ]
    };

    static HUMID_GRADIENT = {
        gradient: [
            "#0E86D4",
            "#055C9D"
        ]
    };

    static getChartData = async (mac) => {
        let res = await fetch(`getChartData/?mac=${mac}`);
        return await res.json();
    }

    static filterChartData = (data, type) => {

    }

    static getDay = (data,date) => {
        let result = [];    
        for (let i = 0; i < data.length; i++) {
            let tmp = new Date(data[i].date);
            if (tmp.getDate() === date.getDate() && tmp.getMonth() === date.getMonth() && tmp.getFullYear() === date.getFullYear()) {
                result.push(data[i]);
            }
        }
        return result;
    }

    static getDataPicker = async () => {
        let res = await fetch('getDataPicker');
        return await res.json();
    }

    static getFormattedData = (data) => {
        let diffTime = Math.abs(new Date() - data);
        if (diffTime / 1000 < 60) {
            if (Math.round(diffTime / 1000) > 5)
                return Math.round(diffTime / 1000) + " secondi";
            else
                return "ora";
        } else if (diffTime / 1000 < 3600) {
            return Math.round(diffTime / 60 / 1000) + " minuti";
        } else if (diffTime / 1000 < 86400) {
            return Math.round(diffTime / 3600 / 1000) + " ore";
        } else if (diffTime / 1000 < 604800) {
            return Math.round(diffTime / 86400 / 1000) + " giorni";
        } else if (diffTime / 1000 < 2419200) {
            return Math.round(diffTime / 604800 / 1000) + " settimane";
        } else if (diffTime / 1000 < 31536000) {
            return Math.round(diffTime / 2419200 / 1000) + " mesi";
        } else if (diffTime / 1000 < 315360000) {
            return Math.round(diffTime / 31536000 / 1000) + " anni";
        }
    }



    static convertTZ = (date, tzString) => {
        return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", { timeZone: tzString }));
    }


    static changeName = (mac) => {
        swal({
            text: 'Cambia il nominativo del dispositivo',
            content: "input",
            button: {
                text: "Cambia!",
                closeModal: false,
            },
        }).then(name => {
            if (!name) throw null;
            return fetch(`changeName?name=${name}&mac=${mac}`);
        }).then(res => {
            return res.text();
        }).then(result => {
            if (result) {
                return swal({ title: "Nominativo cambiato!", text: "Il dispositivo è stato rinominato. ✅", icon: "success" });
            } else {
                return swal("Errore!", "Impossibile cambiare il nominativo", "error");
            }
        }).catch(err => {
            if (err) {
                swal("Errore!", "C'é stato un errore di connessione", "error");
            } else {
                swal.stopLoading();
                swal.close();
            }
        });
    }

    static removeDevice = (mac) => {
        swal({
            text: 'Sicuro di voler rimuovere il dispositivo?',
            icon: "warning",
            buttons: true,
            dangerMode: true
        }).then(willDelete => {
            if (!willDelete) throw null;
            return fetch(`removeDevice?mac=${mac}`);
        }).then(res => {
            return res.text();
        }).then(result => {
            if (result) {
                return swal({ title: "Dispositivo rimosso!", text: "Il dispositivo è stato rimosso. ✅", icon: "success" });
            } else {
                return swal("Errore!", "Impossibile eliminare il dispositivo", "error");
            }
        }).catch(err => {
            if (err) {
                swal("Errore!", "C'é stato un errore di connessione", "error");
            } else {
                swal.stopLoading();
                swal.close();
            }
        });
    }

    static customText = (text) => {
        let temp_text = [
            { text: text, size: "1.2rem", color: '#fff', x: 100, y: 100, font: "Arial Black" },
        ];
        return temp_text;
    }
}
export default Util;