import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v1 } from 'uuid'

import { MIN_COLUMN } from '../../../constants'
import { ItemType, ItemTypeWithOrder } from '../../../types/types'
import {
    getRandomHexColor,
    getRandomImgUrl,
    getRandomNumber,
} from '../../../utils'
import { addItemInGridRowTC, swapGridLayoutElementTC } from '../../thunk'
import { InitGridLayoutStateType, RowsType } from '../../types'

const FakeData: ItemType[] = [...Array(getRandomNumber(10, 20))].map((_) => ({
    id: v1(),
    // url: getRandomImgUrl(
    //     getRandomNumber(1, 3) * 100,
    //     getRandomNumber(2, 3) * 100,
    //     getRandomNumber(0, 100)
    // ),
    url: getRandomImgUrl(200, 200, getRandomNumber(0, 100)),
    backgroundColor: getRandomHexColor(),
}))

const initialGridLayoutState: InitGridLayoutStateType = {
    rows: [],
    layouts: {},
    imageData: FakeData,
}

const gridLayoutSlice = createSlice({
    name: 'GridLayout',
    initialState: initialGridLayoutState,
    reducers: {
        addGridRowAC: (state, action: PayloadAction<RowsType>) => {
            //const rowId = v1()
            state.layouts = {
                ...state.layouts,
                [action.payload.id]: [],
            }
            state.rows.push({
                id: action.payload.id,
                order: action.payload.order,
            })
        },
        addItemInGridRowAC: (
            state,
            action: PayloadAction<{
                rowId: string
                item: ItemTypeWithOrder
            }>
        ) => {
            if (action.payload.rowId === '') return
            const orderRow = state.rows.find(
                (row) => row.id === action.payload.rowId
            )
            const lengthItemInGridRow =
                state.layouts[action.payload.rowId].length
            if (orderRow) {
                /**
                 * orderRow => orderRow.order => номер строки где распологать новый элемент
                 * gridArea: `${orderRow.order}/1/${orderRow.order}/13`
                 *=
                 * lengthItemInGridRow
                 * const step = 12
                 *
                 * gridArea: `$1/ ==> (1?) <==  /1/  ==> (2?) <==  `
                 *
                 * 1?                       2?
                 *
                 * 12 * 0 = 0 + 1  (1)      12 * 0 = 0 + 1 + step  (13)
                 * 12 * 1 = 12 + 1 (13)     12 * 1 = 12 + 1 + step (25)
                 * 12 * 2 = 24 + 1 (25)     12 * 2 = 24 + 1 + step (36)
                 * 12 * 3 = 36 + 1 (37)     12 * 3 = 36 + 1 + step (48)
                 * 12 * 4 = 48 + 1  (49)    12 * 4 = 48 + 1 + step (61)
                 */
                const step = MIN_COLUMN
                const area = step * lengthItemInGridRow
                const itemWithCurrentRow = {
                    ...action.payload.item,
                    order: lengthItemInGridRow + 1,
                    gridArea: `${orderRow.order}/${area + 1}/${
                        orderRow.order
                    }/${area + 1 + step}`,
                } as ItemTypeWithOrder

                state.layouts[action.payload.rowId].push(itemWithCurrentRow)
                return
            }
            state.layouts[action.payload.rowId].push(action.payload.item)
        },
        updateItemInGridRowAC: (
            state,
            action: PayloadAction<{
                rowId: string
                newFullRow: ItemTypeWithOrder[]
                //itemId: string
                //newGridArea: string
                //tempIncreaseValue: number
            }>
        ) => {
            state.layouts[action.payload.rowId] = action.payload.newFullRow
            //console.log('updateItemInGridRowAC state => ', state)
            //console.log('1231312', state.layouts[action.payload.rowId])
            //console.log('newGridArea =>>>', action.payload.newGridArea)
            // const step = 12
            //
            // const indexEl = state.layouts[action.payload.rowId].findIndex(
            //     (el) => el.id === action.payload.itemId
            // )
            // if (indexEl > -1) {
            //     const oldEnd =
            //         +state.layouts[action.payload.rowId][
            //             indexEl
            //         ].gridArea.split('/')[3]
            //     const newEnd = +action.payload.newGridArea.split('/')[3]
            //     const difference = newEnd - oldEnd
            //     const updatedData = updateGridArea(
            //         state.layouts[action.payload.rowId],
            //         action.payload.itemId,
            //         action.payload.tempIncreaseValue
            //     )
            //     if (updatedData) {
            //         state.layouts[action.payload.rowId] = updatedData
            //     }
            //     // state.layouts[action.payload.rowId][indexEl].gridArea =
            //     //     action.payload.newGridArea
            //
            //     getLogBoxReduxToolkit('updatedData', updatedData)
            //     // for (
            //     //     let i = indexEl + 1;
            //     //     i < state.layouts[action.payload.rowId].length;
            //     //     i++
            //     // ) {
            //     //     getLogBoxReduxToolkit(
            //     //         '123',
            //     //         state.layouts[action.payload.rowId][i]
            //     //     )
            //     //     console.log('=>>>', endColumn + step * i)
            //     // }
            // }
            // state.layouts = {
            //     ...state.layouts,
            //     [action.payload.rowId]: state.layouts[action.payload.rowId].map(
            //         (el) =>
            //             el.id === action.payload.itemId
            //                 ? {
            //                       ...el,
            //                       gridArea: action.payload.newGridArea,
            //                   }
            //                 : el
            //     ),
            // }
            // const item = state.layouts[action.payload.rowId]
            // console.log('state.layouts', state.layouts)
            // const index = item.findIndex((t) => t.id === action.payload.rowId)
            // if (index > -1) {
            //     item[index] = {
            //         ...item[index],
            //         columnPercent: action.payload.columnPercent,
            //     }
            // }
            // state.layouts[action.payload.rowId] = state.layouts[
            //     action.payload.rowId
            // ].map((el) =>
            //     el.id === action.payload.rowId
            //         ? { ...el, columnPercent: action.payload.columnPercent }
            //         : el
            // )
        },
        updateOrderInRowWithIncrementAC: (
            state,
            action: PayloadAction<{
                rowId: string
                gridElId: string
                order: number
            }>
        ) => {
            const rowId = v1()
            const length = state.rows.length + 1
            //создание новой строки в гриде
            state.rows.push({ id: rowId, order: state.rows.length + 1 })
            //все элементы из ROW
            const nextRow = state.rows.find(
                (el) => el.order === action.payload.order + 1
            )
            if (nextRow) {
                //console.log('nextRow=>>>', nextRow.id)
                const nextGridRow = state.layouts[nextRow.id]
                const currentGridElement = state.layouts[
                    action.payload.rowId
                ].find((el) => el.id === action.payload.gridElId)
                if (currentGridElement) {
                    const gridArea = currentGridElement.gridArea
                    console.log('gridArea=>>>', gridArea)
                    let arrGridAreaValues = gridArea.split('/')
                    arrGridAreaValues[2] = +arrGridAreaValues[2] + 2 + ''
                    const newGridArea = arrGridAreaValues.join('/')
                    console.log('newGridArea=>>>', newGridArea)
                    currentGridElement.gridArea = newGridArea
                    state.layouts[nextRow.id] = []
                    state.layouts = {
                        ...state.layouts,
                        [rowId]: nextGridRow.map((el) => {
                            let arrGridAreaValues = el.gridArea.split('/')
                            arrGridAreaValues[0] =
                                +arrGridAreaValues[0] + 1 + ''
                            arrGridAreaValues[2] =
                                +arrGridAreaValues[2] + 1 + ''
                            const newGridArea = arrGridAreaValues.join('/')
                            console.log('newGridArea in map =>>>', newGridArea)
                            return { ...el, gridArea: newGridArea }
                            //return { ...el }
                        }),
                    }
                }
            }

            //
        },
        updateGridAreaIncRowAC: (
            state,
            action: PayloadAction<{
                rowId: string
                elId: string
                newGridArea: string
            }>
        ) => {
            const { rowId, elId, newGridArea } = action.payload
            state.layouts[rowId] = state.layouts[rowId].map((el) =>
                el.id === elId ? { ...el, gridArea: newGridArea } : el
            )
        },
        addFakeGridElAC: (
            state,
            action: PayloadAction<{ rowId: string; position: number }>
        ) => {
            const { rowId, position } = action.payload
            const row = state.rows.find((el) => el.id === rowId)
            if (row) {
                const { order } = row
                const fakePosition: { [key: number]: string } = {
                    1: `${order}/1/${order}/13`,
                    2: `${order}/13/${order}/25`,
                    3: `${order}/25/${order}/37`,
                    4: `${order}/37/${order}/49`,
                    5: `${order}/49/${order}/61`,
                }
                const fakeEl = {
                    ...FakeData[0],
                    gridArea: fakePosition[position],
                    url: '',
                    order: position,
                    type: 'fake',
                } as ItemTypeWithOrder
                state.layouts[rowId] = [fakeEl]
            }
        },
        removeGridEl: (
            state,
            action: PayloadAction<{ rowId: string; elId: string }>
        ) => {
            const { rowId, elId } = action.payload
            const currentRow = state.layouts[rowId]
            const index = currentRow.findIndex((t) => t.id === elId)
            if (index > -1) {
                currentRow.splice(index, 1)
            }
        },
        moveItemAC: (
            state,
            action: PayloadAction<{
                rowId: string
                fromOrder: number
                toOrder: number
            }>
        ) => {
            const { rowId, fromOrder, toOrder } = action.payload
            const fromItem = state.layouts[rowId].find(
                (el) => el.order === fromOrder
            )
            const toItem = state.layouts[rowId].find(
                (el) => el.order === toOrder
            )
            if (fromItem && toItem) {
                fromItem.order = toOrder
                toItem.order = fromOrder
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(addItemInGridRowTC.fulfilled, (state, action) => {
                const { rowId, activeColumn, item } = action.payload
                const lengthItemInGridRow = state.layouts[rowId].length
                if (rowId === '' || lengthItemInGridRow >= 6) return
                const currentRow = state.rows.find(
                    (row) => row.id === action.payload.rowId
                )
                if (currentRow) {
                    //const step = MIN_COLUMN
                    //const area = step * lengthItemInGridRow
                    const itemWithCurrentRow = {
                        ...item,
                        order: lengthItemInGridRow + 1,
                        gridArea: `${currentRow.order}/${activeColumn}/${
                            currentRow.order
                        }/${activeColumn + MIN_COLUMN}`,
                    } as ItemTypeWithOrder

                    state.layouts[action.payload.rowId].push(itemWithCurrentRow)
                    return
                }
            })
            .addCase(swapGridLayoutElementTC.fulfilled, (state, action) => {
                const { rowId, newCurrentRow } = action.payload
                console.log('newCurrentRow', newCurrentRow)
                state.layouts = {
                    ...state.layouts,
                    [rowId]: newCurrentRow,
                }
            })
    },
})

export const gridLayoutReducer = gridLayoutSlice.reducer

export const {
    addGridRowAC,
    addItemInGridRowAC,
    updateItemInGridRowAC,
    updateOrderInRowWithIncrementAC,
    updateGridAreaIncRowAC,
    addFakeGridElAC,
    removeGridEl,
    moveItemAC,
} = gridLayoutSlice.actions
