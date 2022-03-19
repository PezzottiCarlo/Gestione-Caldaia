import "./Chart.css";
import React, { useState } from 'react';
import { ResponsiveContainer, LineChart,CartesianGrid, Line, XAxis, YAxis, Tooltip } from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        let date = new Date(label).toLocaleTimeString('it-IT', { 'month': 'long', 'day': '2-digit', hour: '2-digit', minute: '2-digit' });
        return (
            <div className="custom-tooltip">
                <p className="label">{`${date}`}</p>
                <div className="custom-tooltip-data">
                    <p className="data-title">Temperatura:</p>
                    <b className="data-value" style={{color:payload[0].stroke}} >{payload[0].value}</b>
                </div>
                <div className="custom-tooltip-data">
                    <p className="data-title">Umidità:</p>
                    <b className="data-value" style={{color:payload[1].stroke}}>{payload[1].value}</b>
                </div>
            </div >
        );
    }
    return null;
};

const CustomizedDot = (props) => {
    return (
        <svg width={0} height={0} />
    )
};

const Chart = (props) => {
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                width={500}
                height={250}
                data={props.data}
                margin={{
                    top: 20, right: 40, bottom: 20, left: 0,
                }}>
                <CartesianGrid stroke="#434a57" strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={
                    (time) => {
                        new Date(time)
                        return new Date(time).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })
                    }
                } />
                <YAxis />
                <Line dataKey="temperature" stroke="#f6d658" type="monotone" dot={<CustomizedDot />} />
                <Line dataKey="humidity" stroke="#0E86D4" type="monotone" dot={<CustomizedDot />}/>
                <Tooltip content={<CustomTooltip />} />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default Chart;