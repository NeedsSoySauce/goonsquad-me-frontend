import { Container } from '@chakra-ui/layout';
import React from 'react';

const Layout = ({ children }) => {
    return <Container maxW="container.lg">{children}</Container>;
};

export default Layout;
