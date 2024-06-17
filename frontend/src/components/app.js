import React from "react";
import "../styles/app.scss";

import Header from "./header"
import Footer from "./footer"
import MainPage from "./mainPage";
import LoginPage from "./loginPage"
import SearchPage from "./searchPage"

import {Routes, Route, useNavigate, useLocation} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";


function App() {
    const navigate = useNavigate()
    const showModal = useSelector((state)=>state.auth.showModal)
    const isAuth = useSelector((state)=>state.auth.isAuth)
    const dispath = useDispatch()
    const checkExpire = ()=>{   
        if (isAuth){
            if (new Date() > new Date(localStorage.getItem('expire'))){
                localStorage.removeItem('accessToken')
                dispath({type:'LOGOUT'})
                console.log('Пользователь деавторизован')
            }
        }
    }

    React.useEffect(()=>{
        console.log('Произошел navigate в мейн', new Date())
        checkExpire()
    }, [navigate])
    
    return (
        <>
        <Header/>
        
        <Routes>
            <Route path='/' element={<MainPage/>}></Route>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/login" element={<LoginPage />} />
        </Routes>
        <Footer/>
        </>
    );
}

export default App;