import { useAuth0 } from '@auth0/auth0-react';
import { Image } from '@chakra-ui/image';
import { Box, Center, Heading, SimpleGrid, Text, VStack } from '@chakra-ui/layout';
import { Skeleton } from '@chakra-ui/skeleton';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Loader from './Loader';

const Games = () => {
    const { isLoading, isAuthenticated } = useAuth0();
    const [state, setState] = useState({
        isLoading: true,
        data: null
    });

    useEffect(() => {
        fetch(process.env.REACT_APP_API_URL + '/games').then((res) =>
            res.json().then((data) => {
                setState({
                    isLoading: false,
                    data: data.items
                });
            })
        );
    });

    console.log(state);

    return (
        <Skeleton isLoaded={!isLoading}>
            {!state.isLoading && (
                <SimpleGrid columns={2} spacing="40px">
                    {state.data.map((game) => (
                        <Box key={game.name} w="150px" h="150px">
                            <Image
                                src={game.background_image}
                                alt={'Picture of ' + game.name}
                                objectFit="cover"
                                boxSize="120px"
                            />
                            <Text>{game.name}</Text>
                        </Box>
                    ))}
                </SimpleGrid>
            )}
        </Skeleton>
    );
};

export default Games;
