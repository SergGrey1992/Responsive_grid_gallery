import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { v1 } from 'uuid'

export type FileType = {
    type: 'image' | 'video' //'image' | 'video'
    originalUrl: string
    thumbnail: string
    poster: string
}

export type ElementType = {
    id: string
    file: null | FileType
    size: number
    order: number
    nestedOrder: null | number
}

const elImg: ElementType = {
    id: v1(),
    file: {
        type: 'image', //'image' | 'video'
        originalUrl: '',
        thumbnail: '',
        poster: '',
    },
    size: 33.4567,
    order: 2,
    nestedOrder: null, //null | number
}
const elImg1: ElementType = {
    id: v1(),
    file: {
        type: 'image', //'image' | 'video'
        originalUrl: '',
        thumbnail: '',
        poster: '',
    },
    size: 33.4567,
    order: 3,
    nestedOrder: 1, //null | number
}
const elH: ElementType = {
    id: v1(),
    file: null,
    size: 33.4567,
    order: 1,
    nestedOrder: null,
}

const elH1: ElementType = {
    id: v1(),
    file: null,
    size: 33.4567,
    order: 4,
    nestedOrder: null,
}

export type GridType = 'slider' | 'row' | ''

export type InitialStateType = {
    id: string
    order: number
    type: GridType
    rowLayout: ElementType[]
}

const initialState: InitialStateType[] = [
    {
        id: v1(),
        order: 1,
        type: '',
        rowLayout: [],
        //rowLayout: [elH, elImg, elImg1, elH1],
        // rowLayout: [elH, [elImg, elImg1], elH1],
    },
    // { id: '2', order: 2, type: 'default', rowLayout: [] },
]

const flexLayoutBeta = createSlice({
    name: 'flexLayoutBeta',
    initialState: initialState,
    reducers: {
        addNewRowFlexBeta: (state) => {
            // state.layout.push({
            //     id: v1(),
            //     children: [],
            // })
            state.push({
                id: v1(),
                order: state.length + 1,
                type: '',
                rowLayout: [],
            })
        },
        changeRowTypeFlexBeta: (
            state,
            action: PayloadAction<{ rowId: string; rowType: GridType }>
        ) => {
            const { rowId, rowType } = action.payload
            const currentEl = state.find((row) => row.id === rowId)
            if (currentEl) {
                currentEl.type = rowType
                if (rowType === 'row') {
                    currentEl.rowLayout.push({
                        id: v1(),
                        file: null,
                        order: currentEl.rowLayout.length + 1,
                        nestedOrder: null,
                        size: 100,
                    })
                }
            }
        },
        addItemInRowFlexBeta: (state, action: PayloadAction<string>) => {
            const rowId = action.payload
            const currentRow = state.find((l) => l.id === rowId)
            if (currentRow) {
                currentRow.rowLayout.push({
                    id: v1(),
                    file: null,
                    order: currentRow.rowLayout.length + 1,
                    nestedOrder: null,
                    size: 100,
                })
            }
        },
        removeItemInRowFlexBeta: (
            state,
            action: PayloadAction<{ rowId: string; itemId: string }>
        ) => {
            const { rowId, itemId } = action.payload
            const currenRow = state.find((row) => row.id === rowId)
            if (currenRow) {
                const index = currenRow.rowLayout.findIndex(
                    (el) => el.id === itemId
                )
                if (index > -1) {
                    /**
                     * !currentEl.file
                     * null => true
                     * {} => false
                     */
                    const isEmpty = !currenRow.rowLayout[index].file
                    if (isEmpty) {
                        if (
                            currenRow.rowLayout[index].nestedOrder &&
                            currenRow.rowLayout[index].nestedOrder === 1
                        ) {
                            //UP ELEMENT
                            currenRow.rowLayout[index + 1].nestedOrder = null
                            currenRow.rowLayout[index].nestedOrder = null
                            currenRow.rowLayout.splice(index, 1)
                            return
                        }
                        if (
                            currenRow.rowLayout[index].nestedOrder &&
                            currenRow.rowLayout[index].nestedOrder === 2
                        ) {
                            //DOWN ELEMENT
                            currenRow.rowLayout[index - 1].nestedOrder = null
                            currenRow.rowLayout[index].nestedOrder = null
                            currenRow.rowLayout.splice(index, 1)
                            return
                        }
                        currenRow.rowLayout[index].nestedOrder = null
                        currenRow.rowLayout.splice(index, 1)
                    } else {
                        currenRow.rowLayout[index].file = null
                    }
                }
                if (currenRow.rowLayout.length === 0) {
                    currenRow.type = ''
                }
            }
            // //console.log('recursion', removeItemRecursive(state.layout, id))
            // state.layout = removeItemRecursive(state.layout, id)
        },
        divideItemInRowFlexBeta: (
            state,
            action: PayloadAction<{ rowId: string; itemId: string }>
        ) => {
            const { rowId, itemId } = action.payload
            const currenRow = state.find((row) => row.id === rowId)
            if (currenRow) {
                const index = currenRow.rowLayout.findIndex(
                    (el) => el.id === itemId
                )
                if (index > -1) {
                    currenRow.rowLayout[index].nestedOrder = 1

                    currenRow.rowLayout.splice(index + 1, 0, {
                        id: v1(),
                        file: null,
                        order: currenRow.rowLayout[index].order + 1,
                        nestedOrder: 2,
                        size: 100,
                    })
                    for (let i = index; i < currenRow.rowLayout.length; i++) {
                        currenRow.rowLayout[i].order += 1
                    }
                }
            }
        },
        addUrlItemInRowFlexBeta: (
            state,
            action: PayloadAction<{ rowId: string; id: string; url: string }>
        ) => {
            const { rowId, id, url } = action.payload
            const currenRow = state.find((row) => row.id === rowId)
            if (currenRow) {
                const index = currenRow.rowLayout.findIndex(
                    (el) => el.id === id
                )
                if (index > -1) {
                    currenRow.rowLayout[index].file = {
                        originalUrl: url,
                        type: 'image',
                        poster: '',
                        thumbnail: '',
                    }
                }
            }
        },
        addUrlItemInSliderRow: (
            state,
            action: PayloadAction<{ rowId: string; url: string }>
        ) => {
            const { rowId, url } = action.payload
            const currentRow = state.find((row) => row.id === rowId)
            if (currentRow && currentRow.type === 'slider') {
                const newItem: ElementType = {
                    id: v1(),
                    file: {
                        type: 'image',
                        originalUrl: url,
                        poster: '',
                        thumbnail: '',
                    },
                    size: 100,
                    order: 1,
                    nestedOrder: null,
                }
                currentRow.rowLayout.push(newItem)
            }
        },
    },
})

export const flexReducer = flexLayoutBeta.reducer
export const {
    addNewRowFlexBeta,
    addItemInRowFlexBeta,
    changeRowTypeFlexBeta,
    removeItemInRowFlexBeta,
    divideItemInRowFlexBeta,
    addUrlItemInRowFlexBeta,
    addUrlItemInSliderRow,
} = flexLayoutBeta.actions
