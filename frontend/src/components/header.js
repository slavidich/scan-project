import React from "react";
import { NavLink  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

function header(){
    const isAuth = useSelector((state) => state.auth.isAuth);
    const dispatch = useDispatch()
    const handleLogout = ()=>{
        localStorage.removeItem('expire')
        localStorage.removeItem('username')
        localStorage.removeItem('accessToken')
        dispatch({type: 'LOGOUT'})
    }
    return(<div className="header">
        <NavLink  to='/' className="header_link"  >Главная страница</NavLink >
        {isAuth?
            <>
                <NavLink  to='/search' className="header_link" >Поиск</NavLink >
                <p>Здравствуйте, {localStorage.getItem('username')}</p>
                <button onClick={handleLogout} >Выйти</button>
            </>
        :
            <>
                <NavLink  to='/login' className="header_link" >Войти</NavLink >
            </>}
        
        
    </div>)
}

export default header