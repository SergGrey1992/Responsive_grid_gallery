import { createAsyncThunk } from '@reduxjs/toolkit'

import { MIN_COLUMN } from '../../../constants'
import { ItemTypeWithOrder } from '../../../types/types'
import { setErrorAC } from '../../reducers'
import { RootState } from '../../types'

export const addItemInGridRowTC = createAsyncThunk<
    { rowId: string; activeColumn: number; item: ItemTypeWithOrder },
    ItemTypeWithOrder,
    { state: RootState }
>(
    'GridLayout/addItemInGridRowTC',
    async (data, { getState, rejectWithValue, dispatch }) => {
        try {
            const activeIdRow = getState().settings.activeIdRow
            const activeColumn = getState().settings.activeIndexColumn[0] + 1
            if (isNaN(activeColumn)) {
                dispatch(setErrorAC('Нету выбраной колонки'))
                return rejectWithValue('NaN')
            }
            const currentLayoutRow = getState().grid.layouts[activeIdRow]
            const positions = currentLayoutRow
                .map((el) => el.gridArea)
                .flatMap((str) => {
                    const [, start, , end] = str.split('/')
                    return [Number(start), Number(end)]
                })
                .sort((a, b) => a - b)
                .map((el) => el)

            if (currentLayoutRow.length > 0) {
                for (let i = 0; i < positions.length; i++) {
                    const currPos = positions[i] // текущая позиция
                    let nextPos = positions[i + 1] // следующая позиция
                    if (nextPos === undefined) {
                        nextPos = 61 // если следующей позиции нет, считаем её равной 61
                    }
                    const distance = nextPos - currPos - 1 // расстояние между текущей и следующей позицией
                    if (
                        distance >= MIN_COLUMN &&
                        activeColumn >= currPos &&
                        activeColumn + MIN_COLUMN - 1 <= nextPos
                    ) {
                        //console.log(`Можно вставить на позицию ${activeColumn}`)
                        return { rowId: activeIdRow, activeColumn, item: data }
                    }
                }
            } else {
                return { rowId: activeIdRow, activeColumn, item: data }
            }
            dispatch(setErrorAC('Нельзя вставить'))
            return rejectWithValue('Нельзя вставить')
        } catch (e) {
            return rejectWithValue('null')
        }
    }
)

export const swapGridLayoutElementTC = createAsyncThunk<
    { rowId: string; newCurrentRow: ItemTypeWithOrder[] },
    { rowId: string; fromOrder: number; toOrder: number },
    { state: RootState }
>(
    'GridLayout/swapGridLayoutElementTC',
    async ({ rowId, fromOrder, toOrder }, { rejectWithValue, getState }) => {
        try {
            const newCurrentRow = [...getState().grid.layouts[rowId]]
            const fromItem = newCurrentRow.find(
                (item) => item.order === fromOrder
            )
            console.log('fromItem', fromItem)
            const toItem = newCurrentRow.find((item) => item.order === toOrder)
            console.log('toItem', toItem)
            if (fromItem && toItem) {
                fromItem.order = toOrder
                toItem.order = fromOrder
                return { rowId, newCurrentRow }
            }
            //const movedItem = newCurrentRow.splice(fromIndex, 1)[0]
            //newCurrentRow.splice(toIndex, 0, movedItem)
            // const newList = [...list];
            // const movedItem = newList.splice(fromIndex, 1)[0]
            // newList.splice(toIndex, 0, movedItem)
            // setList(newList)
            console.log('prev=> ', getState().grid.layouts[rowId])
            console.log('newCurrentRow', newCurrentRow)
            return { rowId, newCurrentRow }
        } catch (e) {
            return rejectWithValue('error')
        }
    }
)
