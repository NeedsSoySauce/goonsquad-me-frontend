import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
    styles: {
        global: {
            body: {
                bg: 'gray.900'
            }
        }
    },
    config: {
        initialColorMode: 'dark',
        useSystemColorMode: false
    },
    fonts: {
        heading: 'monospace',
        body: 'monospace'
    }
});

export default theme;
