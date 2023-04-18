import React from 'react'

import {
    AlertComponent,
    ControlsGridLayout,
    DropSquare,
    HelpMonitor,
    MediaLibrary,
} from './components'

import './App.css'

function App() {
    return (
        <div className="App">
            <HelpMonitor />
            <AlertComponent />
            <ControlsGridLayout />
            <div className={'dropSquareContainer'}>
                <DropSquare />
            </div>
            <MediaLibrary />
            {/*<Layer />*/}
        </div>
    )
}

export default App
