import React, {useState} from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Navigate } from 'react-router-dom';
import axios from "axios";
import SearchResults from "./searchResults.jsx";

function searchPage(){
    const isAuth = useSelector((state) => state.auth.isAuth);
    const [searchGo, setsearchGo] = useState(null);
    const [formData, setFormData] = useState({
        inn: '86 020 605 55',
        tone: 'any',
        documentCount: '500',
        startDate: '2024-05-17',
        endDate: '2024-06-17',
        maxCompleteness: true,
        businessContext: true,
        mainRole: true,
        riskFactors: true,
        technicalNews: false,
        announcements: false,
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
                setErrors({ ...errors, documentCount: true });
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
        const currentDate = new Date().toISOString().split('T')[0];
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
    return(<>
    {searchGo?
        (<SearchResults formData={formData} closeResults={closeResults}/>)
        :
        (<div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>ИНН компании *</label>
                    <input
                        type="text"
                        name="inn"
                        value={formData.inn}
                        onChange={handleChange}
                        maxLength="13"
                        required
                    />
                    {errors.inn && <p>ИНН должен состоять из 10 цифр!</p>}
                </div>
                <div>
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
                <div>
                    <label>Количество документов в выдаче *</label>
                    <input
                        name="documentCount"
                        value={formData.documentCount}
                        onChange={handleChange}
                        min="1"
                        max="1000"
                        required
                    />
                    {errors.documentCount && <p>Укажите значение от 1 до 1000</p>}
                </div>
                <div>
                    <label>Диапазон поиска *</label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                    {errors.date && <p>Введите корректное значение</p>}
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="maxCompleteness"
                            checked={formData.maxCompleteness}
                            onChange={handleChange}
                        />
                        Признак максимальной полноты
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="businessContext"
                            checked={formData.businessContext}
                            onChange={handleChange}
                        />
                        Упоминания в бизнес-контексте
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="mainRole"
                            checked={formData.mainRole}
                            onChange={handleChange}
                        />
                        Главная роль в публикации
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="riskFactors"
                            checked={formData.riskFactors}
                            onChange={handleChange}
                        />
                        Публикации только с риск-факторами
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="technicalNews"
                            checked={formData.technicalNews}
                            onChange={handleChange}
                        />
                        Включать технические новости рынков
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="announcements"
                            checked={formData.announcements}
                            onChange={handleChange}
                        />
                        Включать анонсы и календари
                    </label>
                </div>
                <div>
                    <label>
                        <input
                            type="checkbox"
                            name="newsSummary"
                            checked={formData.newsSummary}
                            onChange={handleChange}
                        />
                        Включать сводки новостей
                    </label>
                </div>
                <button type="submit" disabled={!isFormValid()}> Поиск</button>
            </form>
        </div>)}
        </>)
}

export default searchPage