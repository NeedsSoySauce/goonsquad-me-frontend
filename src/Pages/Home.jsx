import { useAuth0 } from '@auth0/auth0-react';
import { Center, Heading, Text, VStack } from '@chakra-ui/layout';
import { Tooltip } from '@chakra-ui/tooltip';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Games from '../Components/Games';
import Loader from '../Components/Loader';

const Home = () => {
    const { isLoading, isAuthenticated } = useAuth0();

    return (
        <Loader isLoading={isLoading}>
            <Center mt="15vh">
                <VStack spacing="6">
                    <Link to="/squads">
                        <Heading width="max-content" size="4xl" _hover={{ textDecoration: 'underline' }}>
                            {isAuthenticated ? '(☞ﾟヮﾟ)☞ ☜(ﾟヮﾟ☜)' : '(((o(*ﾟ▽ﾟ*)o)))'}
                        </Heading>
                    </Link>
                    <Tooltip
                        label={isAuthenticated ? 'Welcome back!' : 'A little higher!'}
                        aria-label="Click me to find a squad"
                    >
                        <Text fontSize="xl">{isAuthenticated ? '^ Hey! I know you! ^' : 'Goonsquad Me! ^'}</Text>
                    </Tooltip>
                    <Text>Here you can see some not so random games.</Text>
                    <Games />
                </VStack>
            </Center>
        </Loader>
    );
};

export default Home;
