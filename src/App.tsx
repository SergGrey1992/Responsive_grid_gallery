import React from 'react'

import { MyFirstGrid } from './components'

import './App.css'

function App() {
    return (
        <div className="App">
            {/*<HelpMonitor />*/}
            {/*<AlertComponent />*/}
            {/*<ControlsGridLayout />*/}
            <div className={'dropSquareContainer'}>
                <MyFirstGrid />
            </div>
            {/*<MediaLibrary />*/}
            {/*<Layer />*/}
        </div>
    )
}

export default App
