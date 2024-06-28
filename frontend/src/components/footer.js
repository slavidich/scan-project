import React from "react";
import "../styles/footer.scss"
import logo from "../img/logo2.png"

function footer(){
    return(<footer className="footer header">
        <div className="footer__logo header__logo"><img src={logo} alt="logo"/></div>
        <div className="footer__text ">
            <p>г. Москва, Цветной б-р, 40</p>
            <p>+7 495 771 21 11</p>
            <p>info@skan.ru</p>
            
            <p><br/>Copyright. 2022</p>
        </div>
    </footer>)
}

export default footer