import moment from 'moment';
import React, { useEffect, useRef } from 'react';
import Pikaday from 'pikaday';
import 'pikaday/css/pikaday.css';
import '../styles/customDateInput.scss';

const DatePicker = ({ name, placeholder, value, onChange, onFocus, onSelect }) => {
    const datepickerRef = useRef(null);
    const inputRef = useRef(null);
    const ruDate = {
        previousMonth : 'Предыдущий месяц',
        nextMonth     : 'Следующий месяц',
        months        : ['Январь', 'Февраль','Март','Апрель','Май','Июнь','Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь',],
        weekdays      : ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', ],
        weekdaysShort : ['Вс','Пн','Вт','Ср','Чт','Пт','Сб']
    }
    useEffect(() => {
        const picker = new Pikaday({
            field: inputRef.current,
            format: 'DD.MM.YYYY',
            i18n: ruDate,
            firstDay: 1,
            onSelect: date => {
                const formattedDate = moment(date).format('DD.MM.YYYY');
                if (onSelect) {
                    onSelect(formattedDate);
                }
                const event = {
                    target: {
                        name: name,
                        value: formattedDate
                    }
                };
                onChange(event);
            },
        });

        return () => picker.destroy();
    }, [name, onChange, onSelect]);

    return (
        <div className="custom-date-input" ref={datepickerRef}>
            <input
                type="text"
                name={name}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onFocus={onFocus}
                ref={inputRef}
                required
            />
            <svg
                className="icon-calendar"
                width="20"
                height="11"
                viewBox="0 0 20 11"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => datepickerRef.current.querySelector('input').click()}
            >
                <path d="M0 0.717529H19.4351L9.71753 10.4351L0 0.717529Z" fill="#D9D9D9"/>
            </svg>
        </div>
    );
};

export default DatePicker;
