import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v1 } from 'uuid'

import { MIN_COLUMN } from '../../../constants'
import { ItemType, ItemTypeWithOrder } from '../../../types/types'
import {
    createGridItem,
    getRandomHexColor,
    getRandomImgUrl,
    getRandomNumber,
} from '../../../utils'
import { addItemInGridRowTC } from '../../thunk'
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
    layoutsFake: {},
    imageData: FakeData,
    tempSettings: {
        increaseValue: 0,
    },
}

const gridLayoutSlice = createSlice({
    name: 'GridLayout',
    initialState: initialGridLayoutState,
    reducers: {
        changeAllData: (
            state,
            action: PayloadAction<{ [key: string]: ItemTypeWithOrder[] }>
        ) => {
            //const rowId = v1()
            state.layouts = action.payload
        },
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
        // addItemInGridRowAC: (
        //     state,
        //     action: PayloadAction<{
        //         rowId: string
        //         item: ItemTypeWithOrder
        //     }>
        // ) => {
        //     const { rowId, item } = action.payload
        //     if (rowId === '') return
        //     const currentRow = state.rows.find((row) => row.id === rowId)
        //     const lengthItemInGridRow = state.layouts[rowId].length
        //     if (currentRow) {
        //         const order = lengthItemInGridRow + 1
        //         const area = MIN_COLUMN * lengthItemInGridRow
        //         const girdArea = `${currentRow.order}/${area + 1}/${
        //             currentRow.order + 1
        //         }/${area + 1 + MIN_COLUMN}`
        //         const item_ = createGridItem(item, order, girdArea)
        //         state.layouts[rowId].push(item_)
        //     }
        // },
        updateItemInGridRowAC: (
            state,
            action: PayloadAction<{
                rowId: string
                newFullRow: ItemTypeWithOrder[]
            }>
        ) => {
            state.layouts[action.payload.rowId] = action.payload.newFullRow
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
            let fromItem = state.layouts[rowId].find(
                (el) => el.order === fromOrder
            )
            let toItem = state.layouts[rowId].find((el) => el.order === toOrder)
            if (fromItem && toItem) {
                const tempUrl = fromItem.url
                const tempBgr = fromItem.backgroundColor
                fromItem.url = toItem.url
                fromItem.backgroundColor = toItem.backgroundColor
                toItem.url = tempUrl
                toItem.backgroundColor = tempBgr
            }
        },
        updateIncreaseValueAC: (state, action: PayloadAction<number>) => {
            state.tempSettings.increaseValue = action.payload
        },
        testUpdateGridAreaAC: (
            state,
            action: PayloadAction<{
                rowId: string
                id: string
                gridArea: string
            }>
        ) => {
            const { rowId, id, gridArea } = action.payload
            const currentElement = state.layouts[rowId].find(
                (el) => el.id === id
            )
            if (currentElement) {
                currentElement.gridArea = gridArea
            }
        },
        testSetNewGridAreaAC: (
            state,
            action: PayloadAction<{
                rowId: string
                id: string
                newGridArea: string
            }>
        ) => {
            const { rowId, id, newGridArea } = action.payload
            const currentEl = state.layouts[rowId].find((el) => el.id === id)
            if (currentEl) {
                currentEl.gridArea = newGridArea
            }
        },
        testSetNewFullLayoutAC: (
            state,
            action: PayloadAction<{ [p: string]: ItemTypeWithOrder[] }>
        ) => {
            state.layouts = action.payload
        },
        setFakeAC: (
            state,
            action: PayloadAction<{ [p: string]: ItemTypeWithOrder[] }>
        ) => {
            state.layouts = action.payload
        },
    },
    extraReducers: (builder) => {
        builder.addCase(addItemInGridRowTC.fulfilled, (state, action) => {
            const { rowId, activeColumn, item } = action.payload
            const lengthItemInGridRow = state.layouts[rowId].length
            if (rowId === '' || lengthItemInGridRow >= 6) return
            const currentRow = state.rows.find(
                (row) => row.id === action.payload.rowId
            )
            if (currentRow) {
                const gridArea = `${currentRow.order}/${activeColumn}/${
                    currentRow.order + 1
                }/${activeColumn + MIN_COLUMN}`
                const itemWithCurrentRow = createGridItem(
                    item,
                    lengthItemInGridRow + 1,
                    gridArea
                )
                state.layouts[action.payload.rowId].push(itemWithCurrentRow)
                return
            }
        })
    },
})

export const gridLayoutReducer = gridLayoutSlice.reducer

export const {
    addGridRowAC,
    updateItemInGridRowAC,
    updateOrderInRowWithIncrementAC,
    updateGridAreaIncRowAC,
    addFakeGridElAC,
    removeGridEl,
    moveItemAC,
    updateIncreaseValueAC,
    testUpdateGridAreaAC,
    changeAllData,
    testSetNewGridAreaAC,
    testSetNewFullLayoutAC,
    setFakeAC,
} = gridLayoutSlice.actions
