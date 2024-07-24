import React, {useState} from "react";
import { useSelector } from "react-redux";
import { Navigate } from 'react-router-dom';
import SearchResults from "./searchResults.jsx";
import '../styles/searchPage.scss'
import CustomDateInput from './customDateInput.jsx'
import {SvgSearchPageMain,SvgSearch1,SvgSearch2} from '../img/allSvg.jsx'

function searchPage(){
    const isAuth = useSelector((state) => state.auth.isAuth);
    const [searchGo, setsearchGo] = useState(null);
    const [formData, setFormData] = useState({
        inn: '86 020 605 55', //
        tone: 'any',
        documentCount: '500', //
        startDate: '17.05.2024', //
        endDate: '17.06.2024', //
        maxCompleteness: true,
        businessContext: true,
        mainRole: true,
        riskFactors: false,
        technicalNews: false,
        announcements: true,
        newsSummary: false,
    });
    const [errors, setErrors] = useState({
        inn: false,
        documentCount: false,
        date: false,
    });
    const isFormValid = () => {
        return (
            formData.inn.length === 13 && !errors.inn &&
            formData.documentCount && !errors.documentCount &&
            formData.startDate &&
            formData.endDate && 
            !errors.date
        );
    };
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        // Валидатор ИНН
        if (name === 'inn') {
            const regex = /^[0-9]*$/;
            if (!regex.test(value.replace(/\s/g, ''))) {
                return;
            } else {
                const formattedValue = formatINN(value)
                if (e.target.value.length===13){
                    setErrors({ ...errors, inn: false });
                }
                else{
                    setErrors({ ...errors, inn: true })
                }
                setFormData({
                    ...formData, 
                    [name]:formattedValue
                })
                return
            }
        }

        // Валидатор количества документов 
        if (name === 'documentCount') {
            const regex = /^[0-9]*$/;
            if (!regex.test(value)){
                return;
            } else {
                if(e.target.value<1 || e.target.value>1000) {
                    console.log(e.target.value, 'Ошибка')
                    setErrors({ ...errors, documentCount: true });
                }
                else{
                    setErrors({ ...errors, documentCount: false });
                }
            }
            
        }

        // валидация даты 
        if (name==='endDate' || name==='startDate'){
            validateDates(name === 'startDate' ? value : formData.startDate, name === 'endDate' ? value : formData.endDate);
        }

        // фиксируем 
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
        
    };
    // Функция для форматирования строки ИНН
    const formatINN = (value) => {
        const digits = value.replace(/\D/g, '');

        let formatted = '';
        if (digits.length > 0) {
            formatted = digits.substring(0, 2);
        }
        if (digits.length > 2) {
            formatted += ' ' + digits.substring(2, 5);
        }
        if (digits.length > 5) {
            formatted += ' ' + digits.substring(5, 8);
        }
        if (digits.length > 8) {
            formatted += ' ' + digits.substring(8, 10);
        }
        return formatted;
    };
    const validateDates = (startDate, endDate)=>{
        const parseDate= (dateString)=>{
            const [day, month, year] = dateString.split('.');
            return new Date(year, month - 1, day);
        }
        startDate = parseDate(startDate)
        endDate = parseDate(endDate)
        const currentDate = new Date()
        if ((startDate && endDate) &&(startDate > endDate || endDate > currentDate)){
            setErrors({
                ...errors,
                date:true
            })
        }
        else{
            setErrors({
                ...errors, 
                date:false
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isFormValid()) {
            return;
        }
        setsearchGo(true)
    }
    const closeResults = ()=>{
        setsearchGo(false)
    }
    
    if (!isAuth){
        return <Navigate to="/" />
    }
    return(
    
    
        
        <>
        <div className="center__div search__center">
            <div className="searchpage">

                {searchGo?(<SearchResults formData={formData} closeResults={closeResults}/>):(<>
                <div className="searchpage__updiv">
                    <div className="searchpage__text">
                            <p>Найдите необходимые<br></br>данные в пару кликов.</p>
                            <p>Задайте параметры поиска. <br></br>
                            Чем больше заполните, тем точнее поиск</p>
                    </div>
                    <div className="searchpage__updiv__svg">
                        <SvgSearch1/>
                        <SvgSearch2/>
                    </div>
                </div>
                <div className="searchpage__downdiv">
                    <form className="searchpage__form" onSubmit={handleSubmit}>
                        <div className="searchpage__form__leftdiv">
                            <div className={`searchForm__inputdiv ${errors.inn? 'searchForm__inputdivError': ''}`}>
                                <label>ИНН компании<span>*</span></label>
                                <input
                                    className={errors.inn?"searchForm__inputError":""}
                                    type="text"
                                    name="inn"
                                    value={formData.inn}
                                    onChange={handleChange}
                                    maxLength="13"
                                    placeholder="10 цифр"
                                    required
                                />
                                {errors.inn && <p className="searchForm__inputdiv__error">Введите корректные данные</p>}
                            </div>
                            <div className="searchForm__inputdiv"> 
                                <label>Тональность</label>
                                <select
                                    name="tone"
                                    value={formData.tone}
                                    onChange={handleChange}
                                    multiple={false}
                                >
                                    <option value="any">Любая</option>
                                    <option value="positive">Позитивная</option>
                                    <option value="neutral">Нейтральная</option>
                                    <option value="negative">Негативная</option>
                                </select>
                            </div>
                            <div className={`searchForm__inputdiv ${errors.documentCount? 'searchForm__inputdivError': ''}`}>
                                <label>Количество документов в выдаче<span>*</span></label>
                                <input
                                    className={errors.documentCount?"searchForm__inputError":""}
                                    name="documentCount"
                                    value={formData.documentCount}
                                    onChange={handleChange}
                                    min="1"
                                    max="1000"
                                    placeholder="От 1 до 1000"
                                    required
                                />
                                {errors.documentCount && <p className="searchForm__inputdiv__error">Укажите значение от 1 до 1000</p>}
                            </div>
                            <div className={`searchForm__inputdiv ${errors.date? 'searchForm__inputdivError': ''}`}>
                                <label>Диапазон поиска<span>*</span></label>
                                <div>
                                    <CustomDateInput 
                                        className={errors.date?"searchForm__inputError":""}
                                        name="startDate"
                                        placeholder="Дата начала"
                                        value={formData.startDate}
                                        onChange={handleChange}  
                                    />
                                    <CustomDateInput
                                        className={errors.date?"searchForm__inputError":""}
                                        name="endDate"
                                        placeholder="Дата конца"
                                        value={formData.endDate}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.date && <p className="searchForm__inputdiv__error">Введите корректные данные</p>}
                            </div>
                    
                        </div>
                        <div className="searchpage__form__rightdiv">
                            <div>
                                <label className={formData.maxCompleteness? "searchform__inputdiv__checkbox":"searchform__inputdiv__checkbox searchform__inputdiv__checkbox__disable"} >
                                    <input
                                        type="checkbox"
                                        name="maxCompleteness"
                                        checked={formData.maxCompleteness}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                    Признак максимальной полноты
                                </label>
                            </div>
                            <div>
                            <label className={formData.businessContext? "searchform__inputdiv__checkbox":"searchform__inputdiv__checkbox searchform__inputdiv__checkbox__disable"} >
                                    <input
                                        type="checkbox"
                                        name="businessContext"
                                        checked={formData.businessContext}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                    Упоминания в бизнес-контексте
                                </label>
                            </div>
                            <div >
                            <label className={formData.mainRole? "searchform__inputdiv__checkbox":"searchform__inputdiv__checkbox searchform__inputdiv__checkbox__disable"} >
                                    <input
                                        type="checkbox"
                                        name="mainRole"
                                        checked={formData.mainRole}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                    Главная роль в публикации
                                </label>
                            </div>
                            <div >
                            <label className={formData.riskFactors? "searchform__inputdiv__checkbox":"searchform__inputdiv__checkbox searchform__inputdiv__checkbox__disable"} >
                                    <input
                                        type="checkbox"
                                        name="riskFactors"
                                        checked={formData.riskFactors}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                    Публикации только с риск-факторами
                                </label>
                            </div>
                            <div >
                            <label className={formData.technicalNews? "searchform__inputdiv__checkbox":"searchform__inputdiv__checkbox searchform__inputdiv__checkbox__disable"} >
                                    <input
                                        type="checkbox"
                                        name="technicalNews"
                                        checked={formData.technicalNews}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                    Включать технические новости рынков
                                </label>
                            </div>
                            <div >
                            <label className={formData.announcements? "searchform__inputdiv__checkbox":"searchform__inputdiv__checkbox searchform__inputdiv__checkbox__disable"} >
                                    <input
                                        type="checkbox"
                                        name="announcements"
                                        checked={formData.announcements}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                    Включать анонсы и календари
                                </label>
                            </div>
                            <div >
                            <label className={formData.newsSummary? "searchform__inputdiv__checkbox":"searchform__inputdiv__checkbox searchform__inputdiv__checkbox__disable"} >
                                    <input
                                        type="checkbox"
                                        name="newsSummary"
                                        checked={formData.newsSummary}
                                        onChange={handleChange}
                                    />
                                    <span className="checkmark"></span>
                                    Включать сводки новостей
                                </label>
                            </div>
                            <button className={isFormValid()? "submit-btn-active submit-btn searchform-btn":"submit-btn searchform-btn"} type="submit" disabled={!isFormValid()}> Поиск</button>
                            <p>* Обязательные к заполнению поля</p>
                        </div>
                    </form>
                    <div className="searchpage__downdiv__svg">
                        <SvgSearchPageMain/>
                    </div>
                </div></>)}
            </div>
        </div>
                               
        </>)
}

export default searchPage