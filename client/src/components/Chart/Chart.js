import "./Chart.css";

import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, LineChart, CartesianGrid, Line, XAxis, YAxis, Tooltip } from 'recharts';
import Util from './Util';

const Chart = (props) => {
    let [chartData, setChartData] = useState([]);
    useEffect(() => {
        setChartData(props.data);
    }, [props.data]);


    return (
        <div className="chart-container">
            {chartData.length > 0 ?
            <ResponsiveContainer width="100%" height={400}>
                <LineChart
                    width={500}
                    data={chartData}
                    margin={{
                        top: 20, right: 40, bottom: 20, left: 0,
                    }}>
                    <CartesianGrid stroke="#434a57" strokeDasharray="3 3" />
                    <XAxis dataKey="date"  tick={{ fontSize: 10 }} tickFormatter={
                        (time) => {
                            new Date(time)
                            if(props.precision === "H")
                                return new Date(time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                            else if(props.precision === "D")
                                return new Date(time).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit' })
                        }
                    } />
                    <YAxis />
                    <Line dataKey="temperature" stroke="#f6d658" type="monotone" dot={<Util.CustomizedDot />} />
                    <Line dataKey="humidity" stroke="#0E86D4" type="monotone" dot={<Util.CustomizedDot />} />
                    <Tooltip content={<Util.CustomTooltip />} />
                </LineChart>
            </ResponsiveContainer>
            : <div className="chart-empty">
                <p>Nessun dato disponibile</p>
            </div>}
        </div>
    );
};

export default Chart;