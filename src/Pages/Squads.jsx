import { useAuth0 } from '@auth0/auth0-react';
import { Center, Text, VStack } from '@chakra-ui/layout';
import { CircularProgress } from '@chakra-ui/progress';
import React, { useContext, useEffect, useState } from 'react';
import { AnimateOnChange } from 'react-animation';
import { SignalRContext } from '../Api/signalR';
import { useApi } from '../Api/useApi';
import Loader from '../Components/Loader';
import MessageList from '../Components/MessageList';

// This is a protected route, so you can assume the user is authenticated here
const Squads = () => {
    const [state, setState] = useState({
        isLoading: false,
        error: null
    });
    const { getAccessTokenSilently } = useAuth0();
    const connection = useContext(SignalRContext);

    const endpoint = process.env.REACT_APP_API_URL;
    const squads = useApi(endpoint + '/goonsquads');

    // Clear loading state once the user has at least one squad
    useEffect(() => {
        if (squads.isLoading || squads.data?.items.length === 0) return;

        setState({
            isLoading: false,
            error: null
        });
    }, [squads.isLoading, squads.data]);

    // Trigger matchmaking if this user doesn't have any squads
    useEffect(() => {
        if (squads.isLoading || squads.data?.items.length > 0 || state.isLoading || state.error) return;

        (async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                    scope: process.env.REACT_APP_AUTH0_SCOPES
                });
                await fetch(endpoint + '/jobs', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                setState({
                    isLoading: true,
                    error: null
                });
                console.log('Started matchmaking...');
            } catch (error) {
                console.error(error);
                setState({
                    isLoading: false,
                    error
                });
            }
        })();
    }, [squads.isLoading, squads.data, state, endpoint, getAccessTokenSilently]);

    // Register handlers for SignalR
    useEffect(() => {
        if (!connection) return;

        const onNotification = (notification) => {
            if (notification.notificationType === 0) {
                connection.invoke('JoinGroup', notification.goonsquadId);
                squads.refresh();
            }
        };

        connection.on('notify', onNotification);
        return () => {
            connection.off('notify', onNotification);
        };
    }, [connection, squads]);

    if (state.error) {
        return (
            <Center mt="15vh">
                <Text>Something went wrong o.0</Text>
            </Center>
        );
    }

    const isLoading = squads.isLoading || squads.data?.items.length === 0 || state.isLoading;

    return (
        <>
            <Loader isLoading={isLoading}>
                <Center mt="15vh">{squads.data?.items.length > 0 && <MessageList squads={squads.data.items} />}</Center>
            </Loader>
            <AnimateOnChange durationOut="100" style={{ display: 'block' }}>
                {isLoading && (
                    <Center mt="15vh">
                        <VStack>
                            <CircularProgress isIndeterminate />
                            <Text>Finding the perfect match...</Text>
                        </VStack>
                    </Center>
                )}
            </AnimateOnChange>
        </>
    );
};

export default Squads;
