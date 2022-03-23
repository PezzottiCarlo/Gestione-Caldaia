class Util {
    static CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            let date = new Date(label).toLocaleTimeString('it-IT', { 'month': 'long', 'day': '2-digit', hour: '2-digit', minute: '2-digit' });
            return (
                <div className="custom-tooltip">
                    <p className="label">{`${date}`}</p>
                    <div className="custom-tooltip-data">
                        <p className="data-title">Temperatura:</p>
                        <b className="data-value" style={{ color: payload[0].stroke }} >{payload[0].value}</b>
                    </div>
                    <div className="custom-tooltip-data">
                        <p className="data-title">Umidità:</p>
                        <b className="data-value" style={{ color: payload[1].stroke }}>{payload[1].value}</b>
                    </div>
                </div >
            );
        }
        return null;
    };

    static CustomizedDot = (props) => {
        return (
            <svg width={0} height={0} />
        )
    };
}
export default Util;