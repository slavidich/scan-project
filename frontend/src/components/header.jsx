import React from "react";
import { NavLink, useNavigate  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import DropDownMenu from "./dropdownmenu.jsx"
import "../styles/header.scss"
import logo from '../img/logo.png';
import avatar from '../img/avatar.png'
import loading from '../img/loading.png'


const MenuButton = ({ onClick }) => (
    <button className="menu-button" onClick={onClick}>
      ☰
    </button>
);


function header(){
    const [isMenuOpen, setMenuOpen] = React.useState(false);
    const isAuth = useSelector((state) => state.auth.isAuth);
    const [balanceIsLoading, setBalanceIsLoading] = React.useState(false)
    const [balance, setBalance] = React.useState({})
    const dispatch = useDispatch()
    const handleLogout = ()=>{
        localStorage.removeItem('expire')
        localStorage.removeItem('username')
        localStorage.removeItem('accessToken')
        dispatch({type: 'LOGOUT'})
        
    }
    const toggleMenu = () => {
        setMenuOpen(!isMenuOpen);
    };
    React.useEffect(()=>{
        if (isAuth){
            setBalanceIsLoading(true)
            const getBalance = async ()=>{
                try{
                    const resp = await axios.get('https://gateway.scan-interfax.ru/api/v1/account/info', 
                    {
                        headers: {
                            Authorization: "Bearer "+localStorage.getItem('accessToken')
                        }
                    })
                    setBalance(resp.data.eventFiltersInfo)
                    setBalanceIsLoading(false)
                }
                catch (error){
                    
                }
            }
            getBalance()
            
        }
    },[isAuth])
    return(<>
    <header className="header">
        <div className="center__div header__center__div">
            <div className="header__logo footer__logo"><img src={logo} alt="logo"/></div>
            <div className="header__nav">
                <NavLink  to='/' className="header__nav__item"  >Главная</NavLink >
                <a href="#" className="header__nav__item">Тарифы</a>
                <a href="#" className="header__nav__item">FAQ</a>
            </div>
            
            
            
            {isAuth?
                <div className="header__user ">
                    <div className="header__user__balance">
                        {balanceIsLoading?<div className="header__user__balance__loading"><img src={loading}></img></div>:
                            <>
                            <div className="header__user__balance__text">
                                <p>Использовано компаний <span>{balance.usedCompanyCount}</span></p>
                                <p>Лимит по компаниям <span>{balance.companyLimit}</span></p>
                            </div>
                            </> }
                    </div>
                    <div className="header__user__profile">
                        <div className="header__user__profile__info">
                            <p>Алексей А.</p>
                            <a className="header__user__profile__logout" href="#" onClick={handleLogout}>Выйти</a>
                        </div>
                        <img src={avatar}></img>
                    </div>
                </div>
                :
                <div className="header__auth">
                    <a className="header__auth__reg" href="#">Зарегистрироваться</a>
                    <svg className="header__auth__svg"><rect></rect></svg>
                    <NavLink  to='/login' className="header__auth__login " >Войти</NavLink >
                </div>}
            <MenuButton onClick={toggleMenu} />  
        </div>
    </header>
    <DropDownMenu isOpen={isMenuOpen} onClose={toggleMenu} logout={handleLogout}/></>
    )
}

export default header