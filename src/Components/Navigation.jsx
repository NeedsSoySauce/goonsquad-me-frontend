import { useAuth0 } from '@auth0/auth0-react';
import { Avatar } from '@chakra-ui/avatar';
import { Button } from '@chakra-ui/button';
import { Box, HStack } from '@chakra-ui/layout';

const Navigation = () => {
    const { isLoading, isAuthenticated, logout, user } = useAuth0();

    if (isLoading || !isAuthenticated) {
        return null;
    }

    return (
        <Box position="fixed" right="0" top="0" p="4">
            <HStack>
                <Button pb="1" h="12" onClick={() => logout()}>
                    logout
                </Button>
                <Avatar name={user.name} src={user.picture} size="sm" />
            </HStack>
        </Box>
    );
};

export default Navigation;
