import { Input } from '@chakra-ui/input';
import { Box, Center, Container, Text, VStack } from '@chakra-ui/layout';
import dateformat from 'dateformat';
import React, { useContext, useEffect, useState } from 'react';
import { SignalRContext } from '../Api/signalR';
import { useApi } from '../Api/useApi';
import { Divider } from '@chakra-ui/react';

// This is a protected route, so you can assume the user is authenticated here
const MessageList = ({ squads }) => {
    const [state, setState] = useState({
        isLoading: true,
        messages: []
    });
    const [value, setValue] = useState('');

    const connection = useContext(SignalRContext);
    const endpoint = process.env.REACT_APP_API_URL;
    const goonsquadId = squads[0].id;
    const messages = useApi(endpoint + `/goonsquads/${goonsquadId}/messages`);

    // Clear loading state once messages have been loaded
    useEffect(() => {
        if (messages.isLoading) return;
        messages.data.items.reverse();
        setState({
            isLoading: false,
            messages: messages.data.items
        });
    }, [messages.isLoading, messages.data]);

    // Register handlers for SignalR
    useEffect(() => {
        if (!connection) return;

        // Messages are ordered oldest to newest
        const onMessage = (message) => {
            console.log('message', message);
            if (message.id) {
                setState((s) => ({
                    ...s,
                    messages: [message, ...s.messages]
                }));
            }
        };

        connection.on('message', onMessage);
        return () => {
            connection.off('message', onMessage);
        };
    }, [connection, squads]);

    const handleChange = (e) => {
        let inputValue = e.target.value;
        setValue(inputValue);
    };

    const handleKeyDown = (event) => {
        if (event.code !== 'Enter' || !value) return;
        // TODO: Sanitize messages
        connection.invoke('SendMessage', value, goonsquadId);
        setValue('');
    };

    if (state.error) {
        return (
            <Center mt="15vh">
                <Text>Something went wrong o.0</Text>
            </Center>
        );
    }

    return (
        <Container maxW="container.md" overflowX="hidden">
            <Input value={value} onChange={handleChange} onKeyDown={handleKeyDown} placeholder="Speak!" mb="24px" />
            <Box px="16">
                <VStack spacing="6" align="flex-start" mb="33vh" divider={<Divider variant="dashed" />}>
                    {state.messages.map((message) => (
                        <Box key={message.id}>
                            <Text fontSize="12px" color="gray.300">
                                {message.goonUsername}
                            </Text>
                            <Text fontSize="24px">{message.content}</Text>
                            <Text fontSize="10px">{dateformat(new Date(message.sentOnUtc))}</Text>
                        </Box>
                    ))}
                </VStack>
            </Box>
        </Container>
    );
};

export default MessageList;
