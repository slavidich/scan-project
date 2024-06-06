import React from "react";
import { UseSelector, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

function modalTokenExpired(){
    const dispatch = useDispatch()
    const handleClose = ()=>{
        dispatch({type:'HIDE_MODAL'})
        localStorage.removeItem('expire')
    }

    return (<div>
        <p>{localStorage.getItem('username')}! Действия Вашего токена авторизации истекло!</p>
        <button onClick={handleClose}>Ок</button>
    </div>)
}

export default modalTokenExpired