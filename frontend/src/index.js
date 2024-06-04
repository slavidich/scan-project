import React from "react";
import App from "./components/app";
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from "react-router-dom"; 
import {Provider} from "react-redux" 
import {configureStore} from '@reduxjs/toolkit'
import reducer from "./redux/reducers/index"

const store = configureStore({
    reducer: reducer
})

const root = createRoot(document.getElementById('root'))
root.render(<Provider store={store}>
                <BrowserRouter>
                    <App/>
                </BrowserRouter>
            </Provider>);