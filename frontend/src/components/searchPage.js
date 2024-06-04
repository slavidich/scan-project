import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function searchPage(){
    const isAuth = useSelector((state) => state.auth.isAuth);
    const navigate = useNavigate()
    React.useEffect(()=>{
        console.log('search render', new Date())
        if (!isAuth) {
            navigate('/')
        }
    }, [isAuth])
    return(<div>
        <p>Страница поиска</p>
    </div>)
}

export default searchPage