import "./Device.css";

import React, { useState } from 'react';
import Chart from '../Chart/Chart';
import ArcProgress from 'react-arc-progress';
import Util from './Util';


const Device = (props) => {

  let [chart, toggleChart] = useState(false);
  let [chartData, setChartData] = useState([]);

  let data = Util.convertTZ(props.data, "Europe/Zurich");
  let date = Util.getFormattedData(data);
  let now = new Date();
  let active = (data.getHours() === now.getHours() && (now.getMinutes() - data.getMinutes()) < 10);

  const changeName = () => {
    Util.changeName(props.mac);
  }

  const showChart = async () => {
    let data = [];
    if (chartData.length === 0) {
      data = await Util.getLog(props.mac);
    }
    toggleChart(!chart);
    setChartData(data);
  }

  const removeDevice = () => {
    Util.removeDevice(props.mac);
  }

  return (
    <div className="device">
      <div className="title">
        <h2>{props.name}</h2>
        <span onClick={changeName} className="modify">✏️</span>
        <span onClick={showChart} className="modify">📈</span>
        {active ? "" : <span onClick={removeDevice} className="modify">🗑️</span>}
      </div>
      <div className="body">
        <div className="sensor">
          <div className="sensor-name">
            <ArcProgress
              thickness={30}
              progress={props.humidity / 100}
              value={props.humidity}
              fillColor={Util.HUMID_GRADIENT}
              customText={Util.customText(props.humidity + "% 💧")}
            />
          </div>
          <div className="sensor-temp">
            <ArcProgress
              fillColor={Util.TEMP_GRADIENT}
              thickness={30}
              progress={props.temperature / 110}
              value={props.temperature}
              customText={Util.customText(props.temperature + "°C 🌡")}
            />
          </div>
        </div>
        <div className="sensor-date">
          <h3>Aggiornato {date} fa</h3>
        </div>
      </div>
      {chart ? <Chart className="chart" data={chartData}></Chart> : ""}
    </div>
  );
};

export default Device;