import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import { InitialSettingsStateType } from '../../types'
import { updateOrderInRowWithIncrementAC } from '../gridLayout/gridLayoutSlice'

const initialSettingsState: InitialSettingsStateType = {
    widthDropSquare: undefined,
    widthOneColumn: undefined,
    widthOneColumnRound: undefined,
    countLoadImgInGrid: undefined,
    showingGridColumns: true,
    showingGridRows: true,
    showingHelperMonitor: false,
    measureRowsHeight: [],
    activeIndexRow: -1,
    activeIdRow: '',
}

const settingsSlice = createSlice({
    name: 'settings',
    initialState: initialSettingsState,
    reducers: {
        setWidthDropSquareAC: (state, action: PayloadAction<number>) => {
            state.widthDropSquare = action.payload
        },
        setWidthOneColumnAC: (state, action: PayloadAction<number>) => {
            state.widthOneColumn = action.payload
        },
        setWidthOneColumnRoundAC: (state, action: PayloadAction<number>) => {
            state.widthOneColumnRound = action.payload
        },
        setCountLoadImgInGridAC: (state) => {
            if (state.countLoadImgInGrid === undefined) {
                state.countLoadImgInGrid = 1
                return
            }
            state.countLoadImgInGrid += 1
        },
        changeShowingGridColumnsAC: (state) => {
            state.showingGridColumns = !state.showingGridColumns
        },
        changeShowingGridRowsAC: (state) => {
            state.showingGridRows = !state.showingGridRows
        },
        setMeasureRowsHeightAC: (state, action: PayloadAction<number[]>) => {
            state.measureRowsHeight = action.payload
        },
        setActiveIndexRowAC: (state, action: PayloadAction<number>) => {
            state.activeIndexRow = action.payload
        },
        setActiveIdRowAC: (state, action: PayloadAction<string>) => {
            state.activeIdRow = action.payload
        },
        setShowingHelperMonitorAC: (state) => {
            state.showingHelperMonitor = !state.showingHelperMonitor
        },
    },
    extraReducers: (builder) => {
        builder.addCase(updateOrderInRowWithIncrementAC.type, (state) => {
            if (state.countLoadImgInGrid) {
                state.countLoadImgInGrid += 1
            }
        })
    },
})

export const settingsReducer = settingsSlice.reducer
export const {
    setWidthDropSquareAC,
    setWidthOneColumnAC,
    setWidthOneColumnRoundAC,
    setCountLoadImgInGridAC,
    changeShowingGridColumnsAC,
    changeShowingGridRowsAC,
    setMeasureRowsHeightAC,
    setActiveIndexRowAC,
    setActiveIdRowAC,
    setShowingHelperMonitorAC,
} = settingsSlice.actions
