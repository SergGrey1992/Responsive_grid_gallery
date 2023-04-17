import React, { useEffect } from 'react'
import { useToast } from '@chakra-ui/react'

import { useAppDispatch, useAppSelector } from '../../hooks'
import { setErrorAC } from '../../store/reducers'

export const AlertComponent = () => {
    const error = useAppSelector((state) => state.settings.error)
    const dispatch = useAppDispatch()
    const toast = useToast()
    useEffect(() => {
        if (error) {
            toast({
                title: `${error}`,
                status: 'error',
                position: 'top',
                isClosable: true,
                onCloseComplete: () => {
                    dispatch(setErrorAC(''))
                },
            })
        }
    }, [error])
    return <></>
}
