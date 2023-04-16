import React from 'react'
import { Button, Checkbox, Container, Stack } from '@chakra-ui/react'
import { v1 } from 'uuid'

import { useAppDispatch, useAppSelector } from '../../hooks'
import {
    addGridRowAC,
    changeShowingGridColumnsAC,
    changeShowingGridRowsAC,
    setCountLoadImgInGridAC,
    setShowingHelperMonitorAC,
} from '../../store/reducers'
import { RowsType } from '../../store/types'

export const ControlsGridLayout = () => {
    const showingGridColumns = useAppSelector(
        (state) => state.settings.showingGridColumns
    )
    const showingGridRows = useAppSelector(
        (state) => state.settings.showingGridRows
    )
    const showingHelperMonitor = useAppSelector(
        (state) => state.settings.showingHelperMonitor
    )
    const rows = useAppSelector((state) => state.grid.rows)

    const activeIdRow = useAppSelector((state) => state.settings.activeIdRow)
    const dispatch = useAppDispatch()
    const addGridRow = () => {
        const rowId__ = v1()
        const newRow = {
            id: rowId__,
            order: rows.length + 1,
        } as RowsType
        dispatch(addGridRowAC(newRow))
        dispatch(setCountLoadImgInGridAC())
    }
    const changeShowingGridColumns = () =>
        dispatch(changeShowingGridColumnsAC())

    const changeShowingGridRows = () => dispatch(changeShowingGridRowsAC())
    const changeShowingMonitor = () => dispatch(setShowingHelperMonitorAC())
    return (
        <Container marginTop={2} marginBottom={5} maxW={'2xl'} centerContent>
            <Stack direction={['row']} spacing="24px">
                <Button colorScheme="teal" size="md" onClick={addGridRow}>
                    Add Grid Row
                </Button>
                <Checkbox
                    size="md"
                    colorScheme="teal"
                    checked={showingGridColumns}
                    onChange={changeShowingGridColumns}
                >
                    {showingGridColumns ? 'Show' : 'Hide'} Grid Column
                </Checkbox>
                <Checkbox
                    size="md"
                    colorScheme="teal"
                    checked={showingGridRows}
                    onChange={changeShowingGridRows}
                >
                    {showingGridRows ? 'Show' : 'Hide'} Grid Rows
                </Checkbox>
                <Checkbox
                    size="md"
                    colorScheme="teal"
                    checked={showingHelperMonitor}
                    onChange={changeShowingMonitor}
                >
                    {showingHelperMonitor ? 'Show' : 'Hide'} Monitor
                </Checkbox>
            </Stack>
        </Container>
    )
}
