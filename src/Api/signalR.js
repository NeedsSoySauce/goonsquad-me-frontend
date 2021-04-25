import { useAuth0 } from '@auth0/auth0-react';
import { HubConnectionBuilder, LogLevel } from '@microsoft/signalr';
import React, { useEffect, useState, useCallback } from 'react';

export const createHubConnection = (accessTokenFactory) => {
    const connection = new HubConnectionBuilder()
        .withUrl(`${process.env.REACT_APP_API_URL}/chat`, { accessTokenFactory })
        .configureLogging(LogLevel.Information)
        .withAutomaticReconnect()
        .build();

    connection.start().catch(() => console.error('Failed to establish a connection'));

    return connection;
};

// This is kinda hacky but it's a hackathon ¯\_(ツ)_/¯
export const SignalRContext = React.createContext(null);

export const SignalRProvider = ({ children }) => {
    const { isAuthenticated, getAccessTokenSilently } = useAuth0();
    const [connection, setConnection] = useState(null);

    const createConnection = useCallback(() => {
        return new HubConnectionBuilder()
            .withUrl(`${process.env.REACT_APP_API_URL}/chat`, {
                accessTokenFactory: async () => {
                    return await getAccessTokenSilently({
                        audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                        scope: process.env.REACT_APP_AUTH0_SCOPES
                    });
                }
            })
            .configureLogging(LogLevel.Information)
            .withAutomaticReconnect()
            .build();
    }, [getAccessTokenSilently]);

    useEffect(() => {
        if (connection && !isAuthenticated) {
            // If not authenticated clear the current connection (if any)
            connection.stop().then(() => console.log('Disconnected'));
            setConnection(null);
        } else if (!connection && isAuthenticated) {
            // If authenticated and there's no connection, create one and start it
            let con = createConnection();
            con.start().catch(() => console.error('SignalR failed to connect'));
            setConnection(con);
        }
    }, [connection, isAuthenticated, createConnection]);

    return <SignalRContext.Provider value={connection}>{children}</SignalRContext.Provider>;
};
