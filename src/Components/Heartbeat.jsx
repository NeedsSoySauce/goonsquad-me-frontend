import { useContext, useEffect } from 'react';
import { SignalRContext } from '../Api/signalR';

const Heartbeat = ({ interval }) => {
    const connection = useContext(SignalRContext);

    useEffect(() => {
        if (!connection) return;

        let timeout = setInterval(() => {
            if (connection && connection.connectionState === 'Connected') {
                connection.invoke('Heartbeat');
            }
        }, interval);

        return () => {
            clearInterval(timeout);
        };
    });

    return null;
};

Heartbeat.defaultProps = {
    interval: 5000
};

export default Heartbeat;
