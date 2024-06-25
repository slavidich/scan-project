import React from "react";
import "../styles/dropdownmenu.scss"

const DropdownMenu = ({ isOpen, onClose }) => (
    isOpen ? (
      <div className="dropdown-menu">
        <button className="close-button" onClick={onClose}>✖</button>
        <ul>
          <li>Главная</li>
          <li>Тарифы</li>
          <li>FAQ</li>
          <li>Зарегистрироваться</li>
          <li><button className="login-button">Войти</button></li>
        </ul>
      </div>
    ) : <></>
);

export default DropdownMenu