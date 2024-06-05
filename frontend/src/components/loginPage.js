import React, {useState} from "react"
import { useDispatch, useSelector } from "react-redux"
import axios from "axios";
import { useNavigate } from "react-router-dom";

function loginPage(){
    const navigate = useNavigate()
    const isAuth = useSelector((state) => state.auth.isAuth);
    const dispatch = useDispatch()
    const [username, setUsername] = useState('usertest');
    const [password, setPassword] = useState('123ewqytr');

    const handleLogin = ()=>{
        dispatch({type:'LOGIN_SUCCESS'})
    }
    const handleSubmit=(e)=>{
        e.preventDefault();
        axios.post('http://localhost:3000/login', {username, password})
        .then(resp=>{
            if (resp.status==200){
                const { username, accessToken, expire} = resp.data
                localStorage.setItem('username', username);
                localStorage.setItem('accessToken', accessToken);
                localStorage.setItem('expire', expire);
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