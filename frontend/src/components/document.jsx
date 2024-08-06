import React from "react";
import '../styles/document.scss'
import png1 from "../img/doc1.png"
import png2 from "../img/doc2.png"
function document(props){
    const data = props.data
    return(<div className="searchpage__results__docsgrid__doc">
        <div className="searchpage__results__docsgrid__doc__top">
            <p>{data.date.toString()} <span>{data.urlTitle}</span></p>
            <h3>{data.title}</h3>
            
            <div className="searchpage__results__docsgrid__doc__cat">
                {data.isTechNews?<p>Технические новости</p>:<></>}
                {data.isAnnouncement?<p>Анонсы и события</p>:<></>}
                {data.isDigest?<p>Сводки новостей</p>:<></>}
            </div>
            <img src={props.index % 2==0? png1:png2}></img>
            <p className="searchpage__results__docsgrid__doc__text">{data.text}</p>
        </div>
        <div className="searchpage__results__docsgrid__doc__bot">
            
            <p>{data.wordCount.toLocaleString('ru-RU')} слова</p>
            {data.url?<a href={data.url} target="_blank">Читать в источнике</a>:<></>}
        </div>
    </div>)
}

export default document