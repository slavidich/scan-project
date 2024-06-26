import React from "react";
import { NavLink, useNavigate  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "../styles/dropdownmenu.scss"
import logo from "../img/logo2.png"

const DropdownMenu = ({ isOpen, onClose, logout }) => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const handleLogout = () =>{
    logout();
    onClose();
  }
  return(
      isOpen ? (
        <div className="dropdown-menu">
          <div className="header ">
            <div class="header__logo">
              <img  src={logo} alt="logo"/>
            </div>
            <button className="close-button menu-button " onClick={onClose}>✖</button>
          </div>
          <div className="dropdown-menu__main">
            <div className="dropdown-menu__main__links">
              <NavLink onClick={onClose} to='/'>Главная</NavLink >
              <a href="#">Тарифы</a>
              <a href="#">FAQ</a>
            </div>
            <div className="dropdown-menu__main__links">
              {isAuth?
                <a  href="#" onClick={handleLogout}>Выйти</a>
              :
                <>
                  <a  className="dropdown-menu__main__links__reg" href="#">Зарегистрироваться</a>
                  <NavLink className="dropdown-menu__main__links__login" onClick={onClose} to='/login'  >Войти</NavLink >
                </>
                }
            </div>
          </div>
        </div>
      ) : <></>
    )
  };

export default DropdownMenu