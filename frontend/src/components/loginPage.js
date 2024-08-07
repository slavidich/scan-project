import React, {useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/loginPage.scss"
import {SvgGoogleLogin, SvgFacebookLogin, SvgYandexLogin, SvgLogin, SvgLoginLocker} from "../img/allSvg.jsx"
import loadingSpinner from '../img/5.gif'

function loginPage(){
    const navigate = useNavigate()
    const isAuth = useSelector((state) => state.auth.isAuth);
    const dispatch = useDispatch()
    const [username, setUsername] = useState(''); //sf_student5
    const [password, setPassword] = useState(''); //LuwAwJf
    const [usernameError, setUsernameError] = useState(false);
    const [passwordError, setPasswordError] = useState(false)
    const [loginLoading, setLoginLoading] = useState(false)
    const handleLogin = ()=>{
        dispatch({type:'LOGIN_SUCCESS'})
    }
    const isFormValid = () => (username && password && !usernameError  && !loginLoading);
    const formatPhoneNumber = (value) => {
        if (value.startsWith('+')) {
          const digitsOnly = value.replace(/\D/g, '');
          if (digitsOnly.length <= 1) {
            return `+${digitsOnly}`;
          } else if (digitsOnly.length <= 4) {
            return `+${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1)}`;
          } else if (digitsOnly.length <= 7) {
            return `+${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4)}`;
          } else if (digitsOnly.length <= 9) {
            return `+${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7)}`;
          } else {
            return `+${digitsOnly.slice(0, 1)} ${digitsOnly.slice(1, 4)} ${digitsOnly.slice(4, 7)} ${digitsOnly.slice(7, 9)} ${digitsOnly.slice(9, 11)}`;
          }
        }
        return value;
      };
    const validateLogin = (value) =>{
        const phoneRegex = /^\+7 \d{3} \d{3} \d{2} \d{2}$/;
        const loginRegex = /^[a-zA-Z0-9_]+$/;
        if ((phoneRegex.test(value) && value.length===16) || loginRegex.test(value)){
            setUsernameError(false)
        }
        else{
            setUsernameError(true)
        }
    }
    const handleChangeLogin = (e) =>{
        const { value } = e.target;
        const formattedValue = formatPhoneNumber(value);
        setUsername(formattedValue);
        validateLogin(formattedValue);
    }
    const handleChangePassword = (e) => {
        const {value} = e.target
        setPassword(value)
        if (value.length===0){
            setPasswordError(true)
        }
        else{
            setPasswordError(false)
        }
        
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        setLoginLoading(true)
        axios.post('https://gateway.scan-interfax.ru/api/v1/account/login', {
            login: username, 
            password: password})
        .then(resp=>{
            if (resp.status==200){
                const { accessToken, expire} = resp.data
                // тест с expire
                let t = new Date()
                t.setSeconds(t.getSeconds()+5)
                //
                localStorage.setItem('username', username);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('expire', expire);
                navigate('/')
                handleLogin()
            }
        })
        .catch(e=>{
            if (e.code=="ERR_NETWORK"){
                console.log('Нет соединения с сервером')
            }
            else if (e.response.status==401){
                setPassword('')
                setPasswordError(true)
                setLoginLoading(false)
            }
        })
    }

    return(<>
        <div className="center__div">
            <div className="login-grid">
                <div className="login-text">
                    <p>Для оформления подписки на тариф, необходимо авторизоваться.</p>
                </div>
                <div className="login-div">
                    
                    <div className="login-container">
                        <SvgLoginLocker className="login-locker"/>
                        <div className="login-header">
                            <button>Войти</button>
                            <button>Зарегистрироваться</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Логин или номер телефона:</label>
                                <input
                                    className={usernameError?"input-group-label-error":"input-group-label-error-hide"}
                                    type="text"
                                    value={username}
                                    onChange={handleChangeLogin}
                                />
                                <p className={usernameError? "":"input-group-error-hide"}>Введите корректные данные</p>
                            </div>
                            <div className="input-group">
                                <label>Пароль:</label>
                                <input
                                    className={passwordError?"input-group-label-error":"input-group-label-error-hide"}
                                    type="password"
                                    value={password}
                                    onChange={handleChangePassword}
                                />
                                <p className={passwordError? "":"input-group-error-hide"}>Неправильный пароль</p>
                            </div>
                            
                            <button className={isFormValid()? "submit-btn-active submit-btn ":"submit-btn"} type="submit" disabled={!isFormValid()}>{loginLoading?<img className="login__loading__spinner" src={loadingSpinner}/>:'Войти'}</button>
                            <a href="#" className="forgot-password">Восстановить пароль</a>
                            <div className="social-login">
                                <p>Войти через:</p>
                                <div className="social-buttons">
                                    <button className="google"><SvgGoogleLogin/></button>
                                    <button className="facebook"><SvgFacebookLogin/></button>
                                    <button className="yandex"><SvgYandexLogin/></button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className="login-svg">
                    <SvgLogin/>
                </div>
            </div>
        </div>
    </>)
}

export default loginPage