import { useEffect, useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';

// Based on: https://github.com/auth0/auth0-react/blob/master/EXAMPLES.md#4-create-a-useapi-hook-for-accessing-protected-apis-with-an-access-token

export const useApi = (url, options = {}) => {
    const { getAccessTokenSilently } = useAuth0();
    const [state, setState] = useState({
        error: null,
        isLoading: true,
        data: null
    });
    const [refreshIndex, setRefreshIndex] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                const accessToken = await getAccessTokenSilently({
                    audience: process.env.REACT_APP_AUTH0_AUDIENCE,
                    scope: process.env.REACT_APP_AUTH0_SCOPES
                });
                const res = await fetch(url, {
                    ...options,
                    headers: {
                        ...options.headers,
                        // Add the Authorization header to the existing headers
                        Authorization: `Bearer ${accessToken}`
                    }
                });
                const data = await res.json();
                setState((s) => ({
                    ...s,
                    data,
                    error: null,
                    isLoading: false
                }));
            } catch (error) {
                setState((s) => ({
                    ...s,
                    error,
                    isLoading: false
                }));
            }
        })();
        // eslint-disable-next-line
    }, [refreshIndex]);

    return {
        ...state,
        refresh: () => setRefreshIndex(refreshIndex + 1)
    };
};
