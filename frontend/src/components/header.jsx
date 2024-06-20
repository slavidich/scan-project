import React from "react";
import { NavLink, useNavigate  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "../styles/header.scss"
import logo from '../img/logo.png';

function header(){
    const navigate = useNavigate()
    const isAuth = useSelector((state) => state.auth.isAuth);
    const [balanceIsLoading, setBalanceIsLoading] = React.useState(false)
    const [balance, setBalance] = React.useState({})
    const dispatch = useDispatch()
    const handleLogout = ()=>{
        localStorage.removeItem('expire')
        localStorage.removeItem('username')
        localStorage.removeItem('accessToken')
        dispatch({type: 'LOGOUT'})
        navigate('/')
    }
    React.useEffect(()=>{
        if (isAuth){
            setBalanceIsLoading(true)
            const getBalance = async ()=>{
                console.log(localStorage.getItem('accessToken'))
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
    return(
    <header className="header-container">
        <div className="logo"><img src={logo} alt="logo"/></div>
        <div className="nav">
            <NavLink  to='/' className="nav-item"  >Главная</NavLink >
            <a href="#" className="nav-item">Главная</a>
            <a href="#" className="nav-item">Главная</a>
        </div>
        
        {isAuth?
            <>
            <div className="userdiv">
                <div className="user-balance">
                    {balanceIsLoading?<p>Загрузка баланса...</p>:
                        <><div className="balance-text">
                            <p>Использовано компаний</p>
                            <p>Лимит по компаниям</p>
                        </div>
                        <div className="balance-count">
                            <p>{balance.usedCompanyCount}</p>
                            <p>{balance.companyLimit}</p>
                        </div></> }
                </div>
                <div className="user-profile">
                    <p>Алексей А.</p>
                    <a className="logout" href="" onClick={handleLogout}>Выйти</a>
                </div>
            </div>
                
                
            </>
        :
            <div className="auth-container">
                <a className="registration" href="#">Зарегистрироваться</a>
                <span class="delimiter"></span>
                <NavLink  to='/login' className="loginButton " >Войти</NavLink >
            </div>}
    </header>)
}

export default header