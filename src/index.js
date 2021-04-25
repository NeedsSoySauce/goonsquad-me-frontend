import { Auth0Provider } from '@auth0/auth0-react';
import { ChakraProvider } from '@chakra-ui/react';
import { createBrowserHistory } from 'history';
import React from 'react';
import ReactDOM from 'react-dom';
import { SignalRProvider } from './Api/signalR';
import App from './App';
import reportWebVitals from './reportWebVitals';
import theme from './theme';

// Custom route callback: https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app
export const history = createBrowserHistory();

const onRedirectCallback = (appState) => {
    // Use the router's history module to replace the url
    history.replace(appState?.returnTo || window.location.pathname);
};

ReactDOM.render(
    <React.StrictMode>
        <Auth0Provider
            domain={process.env.REACT_APP_AUTH0_DOMAIN}
            clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
            redirectUri={window.location.origin}
            audience={process.env.REACT_APP_AUTH0_AUDIENCE}
            scope={process.env.REACT_APP_AUTH0_SCOPES}
            onRedirectCallback={onRedirectCallback}
            useRefreshTokens
        >
            <SignalRProvider>
                <ChakraProvider theme={theme}>
                    <App />
                </ChakraProvider>
            </SignalRProvider>
        </Auth0Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
