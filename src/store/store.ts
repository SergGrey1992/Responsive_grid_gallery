import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { flexReducer } from './reducers/flexLayoutBeta/flexLayoutBeta'
import { gridLayoutReducer, settingsReducer } from './reducers'

const rootReducer = combineReducers({
    grid: gridLayoutReducer,
    settings: settingsReducer,
    flex: flexReducer,
})

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({
            serializableCheck: false,
        })
    },
})

export default store

//@ts-ignore
window.store = store
