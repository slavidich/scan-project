import React from "react";
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import MainSlider from "./mainSlider.jsx"
import '../styles/mainPage.scss';

function mainPage(){
    const isAuth = useSelector((state)=>state.auth.isAuth);

    return(<>
        {isAuth && <Link to='/search'>Запросить данные</Link>}
        <MainSlider></MainSlider>
    </>)
}
export default mainPage