import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { gridLayoutReducer, settingsReducer } from './reducers'

const rootReducer = combineReducers({
    grid: gridLayoutReducer,
    settings: settingsReducer,
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
