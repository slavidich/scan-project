import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

function searchPage(){
    const isAuth = useSelector((state) => state.auth.isAuth);
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [formData, setFormData] = useState({
        inn: '',
        tone: ['Любая', 'Позитивная', 'Негативная'],
        documentCount: '',
        startDate: '',
        endDate: '',
        maxCompleteness: true,
        businessContext: true,
        mainRole: true,
        riskFactors: false,
        technicalNews: false,
        announcements: true,
        newsSummary: false,
    });
    const handleChange = (e)=>{
        const {name, value, type, checked} = e.target;
        setFormData({
            ...formData,
            [name]: type==='checkbox'? checked : value
        })
    }
    return(<>
    {isAuth ? 
        <div>
            <p>Страница поиска</p>
        </div>
    :
        <div>Error 403!</div>}</>)
}

export default searchPage