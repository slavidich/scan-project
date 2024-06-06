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
        if (isAuth&&!showModal){
            console.log('пользователь авторизирован')
            if (new Date() > new Date(localStorage.getItem('expire'))){
                console.log('Токен деактивирован!')
                dispath({type:'SHOW_MODAL'})
                localStorage.removeItem('accessToken')
                dispath({type:'LOGOUT'})
            }
        }
    }

    React.useEffect(()=>{
        checkExpire()
        if (showModal){
            dispath({type:'HIDE_MODAL'})
            localStorage.removeItem('expire')
        }
    }, [navigate])
    
    return (
        <>
        {showModal && <ModalTokenExpired/>}
        <Header/>
        {isAuth && <button>Кнопка авторизированного пользователя</button>}
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