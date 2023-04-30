import React, { useEffect } from 'react'
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
import { getAllGridElements } from '../../utils'
import { createGridFromState } from '../../utils/createGridFromState'
import { updateGridAreas } from '../../utils/updateGrisAreas'

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
    const layouts = useAppSelector((state) => state.grid.layouts)

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
    useEffect(() => {
        const grid = createGridFromState(layouts)
        //console.log('grid', grid)
    }, [layouts])
    // const testing = () => {
    const fullGridElements = getAllGridElements(layouts)
    // console.log(
    //     'fullGridElements',
    //     fullGridElements.map((el) => el.gridArea)
    // )
    //const updateGridAreas_ = updateGridAreas(fullGridElements, 1, 5)
    //const gr = updateGridAreas_.map((el) => el.gridArea)
    //console.log('gr', gr)
    //     const updatedLayouts: { [p: string]: ItemTypeWithOrder[] } = {
    //         ...layouts,
    //     }
    //
    //     Object.keys(updatedLayouts).forEach((rowId) => {
    //         updatedLayouts[rowId] = updatedLayouts[rowId].map(
    //             (el: ItemTypeWithOrder) => {
    //                 const updatedItem = updateGridAreas_.find(
    //                     (item) => item.id === el.id
    //                 )
    //                 if (updatedItem) {
    //                     return {
    //                         ...el,
    //                         gridArea: updatedItem.gridArea,
    //                     }
    //                 }
    //                 return el
    //             }
    //         )
    //     })
    //
    //     // updateGridAreas_.forEach((item) => {
    //     //     const key = `item${item.order}`
    //     //     if (!updatedLayouts[key]) {
    //     //         updatedLayouts[key] = []
    //     //     }
    //     //     updatedLayouts[key].push(item)
    //     // })
    //     console.log('layouts', layouts)
    //     console.log('updatedLayouts', updatedLayouts)
    //     dispatch(setFakeAC(updatedLayouts))
    // }
    // const testing11 = () => {
    //     const newL = expandAndShift(
    //         '0f124581-e530-11ed-8c4d-39d122b2abf6',
    //         20,
    //         layouts
    //     )
    //     console.log('newL => ', newL)
    // }

    const testing = () => {
        const fullGridElements = getAllGridElements(layouts)
        const updateGridAreas_ = updateGridAreas(fullGridElements, 1, 5)
        console.log('updateGridAreas_', updateGridAreas_)
    }

    const changeShowingGridRows = () => dispatch(changeShowingGridRowsAC())
    const changeShowingMonitor = () => dispatch(setShowingHelperMonitorAC())
    return (
        <Container marginTop={2} marginBottom={5} maxW={'2xl'} centerContent>
            <Stack direction={['row']} spacing="24px">
                <Button colorScheme="teal" size="md" onClick={addGridRow}>
                    Add Grid Row
                </Button>
                <Button colorScheme="teal" size="md" onClick={testing}>
                    Testing
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
