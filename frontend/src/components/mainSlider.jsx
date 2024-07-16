import React from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import btnprev from '../img/button_prev.png'
import "../styles/mainSlider.scss"
import {Svg1, Svg2, Svg3}  from "../img/allSvg.jsx"

function CustomSlide(props){
    const {item, ...otherProps } = props
    return (
        <div {...otherProps} className="slider-element">
            <div className="slider-element__in">
                <div className="slider-element__in__svg">
                    <item.svg/>
                </div>
                <p>{item.text}</p>
            </div>
        </div>
    )
}
function SampleArrow(props) {
    const { img, className, style, onClick, rotate } = props;
    return (
      <img
        src={img}
        className={className}
        style={{ ...style,  
            transform: rotate? "translate(0, -50%) rotate(180deg)":undefined,}}
        onClick={onClick}
      />
    );
}


function mainSlider(){
    const items = [
        { text: "Высокая и оперативная скорость обработки заявки", svg: Svg1 },
        { text: "Огромная комплексная база данных, обеспечивающая объективный ответ на запрос", svg: Svg2 },
        { text: "Защита конфеденциальных сведений, не подлежащих разглашению по федеральному законодательству", svg: Svg3 },
        { text: "Заглушка №1, для визуализации слайдера testtest", svg: Svg1 },
        { text: "Заглушка №2, для визуализации слайдера testtest", svg: Svg2 },
        { text: "Заглушка №3, для визуализации слайдера testtest", svg: Svg3 },
        { text: "Заглушка №4, для визуализации слайдера testtest", svg: Svg1 },
        { text: "Заглушка №5, для визуализации слайдера testtest", svg: Svg2 }
    ];
    const settings = {
        className: "center",
        infinite: true,
        slidesToShow: 3,
        swipeToSlide: true,
        arrows: true,
        autoplay: false,
        nextArrow: <SampleArrow img={btnprev} />,
        prevArrow: <SampleArrow img={btnprev}  rotate={true}/>,
        responsive:[
            {
                breakpoint:768,
                settings:{
                    slidesToShow: 2
                }
            },
            {
                breakpoint:680,
                settings:{
                    slidesToShow: 1
                }
            }
        ]
    };
    return (
    <div className="slider-container">
        <Slider {...settings}>
            {items.map((item, index)=><CustomSlide key={index} item={item} />)}
        </Slider>
    </div>)
}
export default mainSlider