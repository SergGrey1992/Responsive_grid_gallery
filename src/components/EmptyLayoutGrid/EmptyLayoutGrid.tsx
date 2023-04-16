import React from 'react'
import { Box } from '@chakra-ui/react'

export const EmptyLayoutGrid = () => {
    return (
        <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            justifyContent={'center'}
            bg={'white'}
            borderWidth={'3px'}
            w={'100%'}
            p={4}
            color={'black'}
        >
            <Box>👆</Box>
            Empty Layout Grid
        </Box>
    )
}
