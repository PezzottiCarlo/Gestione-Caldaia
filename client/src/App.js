import './App.css';
import React, { useState, useEffect } from 'react';
import Device from './components/Device/Device';

function App() {

  let [lastStatus, setLastStatus] = useState(null);

  useEffect(() => {
    requestLastState();
    setInterval(requestLastState, 1000);
  }, [])

  const requestLastState = () => {
    fetch('getCurrent')
      .then(res => res.json())
      .then(data => {
        setLastStatus(data);
      })
  }

  return (
    <div className="App">
      {
        (lastStatus) ?
          (lastStatus.length !== 0) ?
            lastStatus.map((device, index) => {
              return (
                <div>
                  <Device className="device"
                    key={index}
                    name={device.name}
                    temperature={device.temperature}
                    humidity={device.humidity}
                    mac={device.mac}
                    data={device.date}
                  />
                </div>
              )
            }) : (<h1>Nessun dispositivo collegato</h1>)
          : (<h1>Errore di connessione...</h1>)
      }   
    </div>
  );
}
export default App;
