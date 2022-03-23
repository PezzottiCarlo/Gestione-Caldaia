import "./Device.css";

import React, { useState } from 'react';
import Chart from '../Chart/Chart';
import ArcProgress from 'react-arc-progress';
import Util from './Util';


const Device = (props) => {

  let [chart, toggleChart] = useState(false);
  let [chartDataPicker, setChartDataPicker] = useState([]);
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
      let tmpChartDataPicker = await Util.getDataPicker();
      setChartDataPicker(tmpChartDataPicker)
      data = await Util.getChartData(props.mac);
    }
    toggleChart(!chart);
    setChartData(Util.getDay(data, new Date()));
  }

  const removeDevice = () => {
    Util.removeDevice(props.mac);
  }

  const listClicking = async (e) => {
    console.log(chartData)
    let items = e.target.parentElement.getElementsByClassName("chart-buttons-list-item");
    for (let i = 0; i < items.length; i++) {
      items[i].classList.remove("active");
      if (items[i].getAttribute("data-index") === e.target.getAttribute("data-index")) {
        items[i].classList.add("active");
      }
    }
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
          <h3>{(date === "ora") ? "Aggiornato ora" : `Aggiornato ${date} fa`}</h3>
        </div>
      </div>
      {
        chart ?
          <div>
            <Chart className="chart" data={chartData}></Chart>
            <div className="chart-buttons">
              <ul className="chart-buttons-list">
                {
                  chartDataPicker.map((item, index) => {
                    return (
                      <li className={`chart-buttons-list-item ${(index === 0) ? "active" : ""}`} data-index={item.value} onClick={listClicking}>{item.label}</li>
                    )
                  })
                }
              </ul>
            </div>
          </div>
          : ""}
    </div>
  );
};

export default Device;