import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function searchPage(){
    const isAuth = useSelector((state) => state.auth.isAuth);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    return(<>{isAuth ? <div>
        <p>Страница поиска</p>
    </div>:<div>Эта страница больше Вам не доступна!</div>}</>)
}

export default searchPage