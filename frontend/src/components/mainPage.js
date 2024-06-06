import React from "react";
import {Link} from "react-router-dom"
import { useDispatch, useSelector } from "react-redux";

function mainPage(){
    const isAuth = useSelector((state)=>state.auth.isAuth)

    return(<>
        {isAuth && <Link to='/search'>Запросить данные</Link>}
    </>)
}
export default mainPage