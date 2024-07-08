import React from "react";
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";
import MainSlider from "./mainSlider.jsx"
import MainTarifs from "./mainTarifs.jsx";
import '../styles/mainPage.scss';
import mainimg1 from "../img/main1.png"
import {SvgMain2} from "../img/slick-svg.jsx"

function mainPage(){
    const isAuth = useSelector((state)=>state.auth.isAuth);

    return(<>
        
        <div className="main__block1">
            <div className="main__block1__text">
                <p className="main__block1__text__1">сервис по поиску<br></br>публикаций<br></br>о компании<br></br>по его ИНН</p>
                <p className="main__block1__text__2">Комплексный анализ публикаций, получение данных в формате PDF на электронную почту.</p>
                {isAuth && <Link className="main__block1__button" to='/search'>Запросить данные</Link>}
            </div>
            <div className="main__block1__img-container">
                <img className="main__block1__img" src={mainimg1} alt="main1"></img>
            </div>
        </div>
        <p className="main__whyus">Почему именно мы</p>
        <MainSlider></MainSlider>
        <div className="main__block2">
            <SvgMain2></SvgMain2>   
        </div>
        <MainTarifs></MainTarifs>
    </>)
}
export default mainPage