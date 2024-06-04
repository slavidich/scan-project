import React from "react";
import "../styles/app.scss";

import Header from "./header"
import Footer from "./footer"
import LoginPage from "./loginPage"
import SearchPage from "./searchPage"

import {Routes, Route, useNavigate} from "react-router-dom"
import { useSelector } from "react-redux";


function App() {
    const navigate = useNavigate()
    const isAuth = useSelector((state) => state.auth.isAuth);
    console.log('рендер главный', isAuth, new Date())

    
    
    return (
        <>
        <Header/>
        <Routes>
            <Route path='/' element={<p>Главная страница</p>}></Route>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Footer/>
        </>
    );
}

export default App;