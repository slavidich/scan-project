import React from "react";
import "../styles/app.scss";

import Header from "./header"
import Footer from "./footer"
import LoginPage from "./loginPage"
import SearchPage from "./searchPage"
import ModalTokenExpired from "./modalTokenExpired";

import {Routes, Route, useNavigate, useLocation} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";


function App() {
    const navigate = useNavigate()
    const showModal = useSelector((state)=>state.auth.showModal)
    const isAuth = useSelector((state)=>state.auth.isAuth)
    const dispath = useDispatch()
    const checkExpire = ()=>{   
        dispath({type:'SHOW_MODAL'})
    }

    React.useEffect(()=>{
        if (isAuth){
            checkExpire()
        }
    }, [navigate])

    React.useEffect(()=>{
        
    }, [isAuth])
    
    return (
        <>
        {showModal && <ModalTokenExpired/>}
        <Header/>
        {isAuth && <p>Пользователь авторизирован</p>}
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