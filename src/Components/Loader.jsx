import { Skeleton } from '@chakra-ui/skeleton';
import { Fade } from '@chakra-ui/transition';

const Loader = ({ isLoading, children }) => {
    return (
        <>
            <Skeleton
                startColor="pink.500"
                endColor="orange.500"
                h="1px"
                w="100vw"
                position="fixed"
                left="0"
                top="0"
                isLoaded={!isLoading}
            ></Skeleton>
            <Fade in={!isLoading}>{children}</Fade>
        </>
    );
};

export default Loader;
