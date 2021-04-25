import { withAuthenticationRequired } from '@auth0/auth0-react';
import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Layout from './Components/Layout';
import Home from './Pages/Home';
import Squads from './Pages/Squads';
import Navigation from './Components/Navigation';
import Heartbeat from './Components/Heartbeat';

// Custom route callback: https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#1-protecting-a-route-in-a-react-router-dom-app
const ProtectedRoute = ({ component, ...args }) => (
    <Route component={withAuthenticationRequired(component)} {...args} />
);

export const App = () => {
    return (
        <HashRouter>
            <Layout>
                <Heartbeat />
                <Navigation />
                <Switch>
                    <Route exact path="/" component={Home} />
                    <ProtectedRoute path="/squads" component={Squads} />
                </Switch>
            </Layout>
        </HashRouter>
    );
};

export default App;
