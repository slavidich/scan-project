import React from "react";
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import btnprev from '../img/button_prev.png'
import "../styles/mainSlider.scss"

function CustomSlide(props){
    const {item, ...otherProps } = props
    return (
        <div {...otherProps}>
            <p>{item}</p>
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
    const items = ['Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5', 'Item 6', 'Item 7', 'Item 8'];
    const settings = {
        className: "center",
        infinite: true,
        slidesToShow: 3,
        swipeToSlide: true,
        arrows: true,
        autoplay: true,
        nextArrow: <SampleArrow img={btnprev}/>,
        prevArrow: <SampleArrow img={btnprev} rotate={true}/>,
    };
    return (
    <div className="slider-container">
        <Slider {...settings}>
            {items.map((item, index)=><CustomSlide key={index} item={item} className="slider-element"/>)}
        </Slider>
    </div>)
}
export default mainSlider