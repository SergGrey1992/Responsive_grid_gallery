import React from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import { ChakraProvider } from '@chakra-ui/react'

import store from './store/store'
import App from './App'
import reportWebVitals from './reportWebVitals'

import './index.css'
import '../node_modules/react-grid-layout/css/styles.css'
import '../node_modules/react-resizable/css/styles.css'

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)
root.render(
    <DndProvider backend={HTML5Backend}>
        <ChakraProvider>
            <Provider store={store}>
                <App />
            </Provider>
        </ChakraProvider>
    </DndProvider>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
