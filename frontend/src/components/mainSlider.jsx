import React from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import btnprev from '../img/button_prev.png'
import "../styles/mainSlider.scss"
import {Svg1, Svg2}  from "../img/slick-svg.jsx"

function CustomSlide(props){
    const {item, ...otherProps } = props
    return (
        <div {...otherProps} className="slider-element">
            <div className="slider-element__in">
                <item.svg/>
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
        { text: "Item 1", svg: Svg1 },
        { text: "Item 2", svg: Svg1 },
        { text: "Item 3", svg: Svg1 },
        { text: "Item 4", svg: Svg1 },
        { text: "Item 5", svg: Svg1 },
        { text: "Item 6", svg: Svg1 },
        { text: "Item 7", svg: Svg1 },
        { text: "Item 8", svg: Svg1 }
    ];
    const settings = {
        className: "center",
        infinite: true,
        slidesToShow: 3,
        swipeToSlide: true,
        arrows: true,
        autoplay: false,
        nextArrow: <SampleArrow img={btnprev}/>,
        prevArrow: <SampleArrow img={btnprev} rotate={true}/>,
    };
    return (
    <div className="slider-container">
        <Slider {...settings}>
            {items.map((item, index)=><CustomSlide key={index} item={item} />)}
        </Slider>
    </div>)
}
export default mainSlider