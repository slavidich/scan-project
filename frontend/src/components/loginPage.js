import React, {useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function loginPage(){
    const navigate = useNavigate()
    const isAuth = useSelector((state) => state.auth.isAuth);
    const dispatch = useDispatch()
    const [username, setUsername] = useState('sf_student5');
    const [password, setPassword] = useState('LuwAwJf');
    
    const handleLogin = ()=>{
        dispatch({type:'LOGIN_SUCCESS'})
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
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
                console.log('Токен получен ', expire)
                navigate('/')
                handleLogin()
            }
        })
        .catch(e=>{
            console.log(e)
            if (e.code=="ERR_NETWORK"){
                console.log('Нет соединения с сервером')
            }
            else if (e.response.status==401){
                console.log('Неправильный логин или пароль!')
            }
        })
    }

    return(<div>
        <p>Страница авторизации</p>
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                placeholder="Логин"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit">Войти</button>
        </form>
    </div>)
}

export default loginPage