import React from "react";
import { NavLink, useNavigate  } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

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
    return(<div className="header">
        <NavLink  to='/' className="header_link"  >Главная страница</NavLink >
        {isAuth?
            <>
                <NavLink to='/search' className="header_link" >Поиск</NavLink >
                {balanceIsLoading?<p>Загрузка баланса...</p>:
                    <div>
                        <p>Использовано: {balance.usedCompanyCount}</p>
                        <p>Лимит: {balance.companyLimit}</p>
                    </div> }
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