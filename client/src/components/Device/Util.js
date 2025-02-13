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

    static filterChartData = async (data, id, precision) => {
        console.log(data);
        let pickers = await Util.getDataPicker();
        if (pickers[id].value === -1) {
            return Util.sortChartDataByDate(data);
        }
        const date1 = new Date();
        const date2 = new Date();
        date1.setDate(date1.getDate() - pickers[id].value + 1);
        date1.setHours(0, 0, 0, 0);
        date2.setHours(23, 59, 59, 999);
        return Util.getChartByRange(Util.sortChartDataByDate(data), date1, date2, precision);
    }

    static getChartByRange = (chartData, startDate, endDate, precision) => {
        let tmpChartData = [];

        let previousDate = null;
        let temps = [];
        let humidity = [];

        for (let i = 0; i < chartData.length; i++) {
            if (new Date(chartData[i].date) >= startDate && new Date(chartData[i].date) <= endDate) {
                if (precision === "D") {
                    if (previousDate === null) {
                        previousDate = new Date(chartData[i].date);
                    }
                    if(previousDate.getDate() !== new Date(chartData[i].date).getDate()) {
                        tmpChartData.push({
                            date: previousDate,
                            temperature: Util.avarege(temps),
                            humidity: Util.avarege(humidity)
                        });
                        temps = [];
                        humidity = [];          
                        temps.push(chartData[i].temperature);
                        humidity.push(chartData[i].humidity);
                        previousDate = new Date(chartData[i].date);
                    }else{
                        temps.push(chartData[i].temperature);
                        humidity.push(chartData[i].humidity);
                    }
                }else if(precision === "H"){
                    tmpChartData.push(chartData[i]);
                }
            }
        }
        return tmpChartData;
    }

    static avarege = (data) => {
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }
        return Math.floor(sum / data.length);
    }

    static sortChartDataByDate(data) {
        return data.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
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