import React from "react";
import "../styles/app.scss";

import Header from "./header.jsx"
import Footer from "./footer.jsx"
import MainPage from "./mainPage.jsx";
import LoginPage from "./loginPage.jsx"
import SearchPage from "./searchPage.jsx"

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
            }
        }
    }

    React.useEffect(()=>{
        checkExpire()
    }, [navigate])
    
    return (
        <>
        <Header/>
        <div className="main">
            <Routes>
                <Route path='/' element={<MainPage/>}></Route>
                <Route path="/search" element={<SearchPage />} />
                <Route path="/login" element={<LoginPage />} />
            </Routes>
        </div>
        
        <Footer/>
        </>
    );
}

export default App;