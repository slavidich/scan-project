import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Document from './document.jsx';
import moment from 'moment';
import {SvgSearchResults} from '../img/allSvg.jsx'
import '../styles/searchResults.scss'
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import btnprev from '../img/button_prev.png'
import {SampleArrow} from '../components/mainSlider.jsx'

function SearchResults(props) {
    const [summaryData, setSummaryData] = useState(0);
    const [summaryIsLoading, setSummaryIsLoading] = useState(true);
    const sliderRef = React.useRef(null);

    const [error, setError] = useState(null)

    const [arrayOfDocuments, setArrayOfDocuments] = useState([])
    const [documentsIsLoading, setDocumentIsLoading] = useState(true)
    const [showedDocuments, setShowedDocuments] = useState(0)
    const [documents, setDocuments] = useState([])

    const [canLoadMore, setCanLoadMore] = useState(true)
    const loadMoreCount = 10
    useEffect(() => {
        const requestBody = {
            intervalType: "month",
            histogramTypes: [
                "totalDocuments",
                "riskFactors"
            ],
            issueDateInterval:{
                startDate: moment(props.formData.startDate, 'DD.MM.YYYY').toDate(),
                endDate:  moment(props.formData.endDate, 'DD.MM.YYYY').toDate()
            },
            searchContext:{
                targetSearchEntitiesContext:{
                    targetSearchEntities:[{
                        inn: props.formData.inn.replace(/\s+/g,""),
                        type:"company",
                        maxFullness:props.formData.maxCompleteness
                    }],
                    onlyMainRole: props.formData.mainRole,
                    tonality: props.formData.tone,
                    onlyWithRiskFactors: props.formData.riskFactors,
                }
            },
            attributeFilters: {
                "excludeTechNews": props.formData.technicalNews,
                "excludeAnnouncements": props.formData.announcements,
                "excludeDigests": props.formData.newsSummary
            },
            limit: props.formData.documentCount,
            similarMode: "duplicates",
            sortType: "sourceInfluence",
            sortDirectionType: "desc",
            businessContext: props.formData.businessContext,
        }
        const fetchSummaryData = async () => {
            setSummaryIsLoading(true);
            try {
                const resp = await axios.post('https://gateway.scan-interfax.ru/api/v1/objectsearch/histograms', requestBody,
                {
                    headers:{
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });
                console.log(resp)
                const combinedData = Object.values(resp.data.data.reduce((dict, current)=>{
                    current.data.forEach(item=>{
                            const date = new Date(item.date);
                            const histogramType = current.histogramType
                            const value = item.value
                            if (!dict[date]){
                                dict[date] = {date: date, totalDocuments: 0, riskFactors: 0}
                            }
                            if (histogramType === "totalDocuments") {
                                dict[date].totalDocuments = value;
                            } else if (histogramType === "riskFactors") {
                                dict[date].riskFactors = value;
                            }
                        });
                        return dict;
                },{})).sort((a,b)=>{
                    let dateA = new Date(a.date)
                    let dateB = new Date(b.date)
                    return dateA-dateB
                })

                const sum = combinedData.reduce((sum, item)=>{
                    return sum+item.totalDocuments
                },0 )
                setSummaryData(() => {
                    const newSummaryData = {
                        allcount: sum,
                        dates: combinedData
                    };
                    console.log(newSummaryData);
                    return newSummaryData;
                });
                setSummaryIsLoading(false)

            } catch (error) {
                console.log(error)
                setError(error.response.status)
            }
        };
        const fetchCount = async() =>{
            setDocumentIsLoading(true)
            try{
                const resp = await axios.post('https://gateway.scan-interfax.ru/api/v1/objectsearch', requestBody,
                {
                    headers:{
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                });
                
                const listOfId = resp.data.items.reduce((list, item)=>{
                    list.push(item.encodedId)
                    return list
                },[])
                setArrayOfDocuments(listOfId)
                setShowedDocuments((prev)=>prev+loadMoreCount)
            }
            catch (error){
                console.log('ОШИБКА 2 ',error)
                setError(500)
            }
        }
        fetchSummaryData()
        fetchCount()
        return(()=>{
            
        })
    }, []);
    React.useEffect(()=>{
        if (showedDocuments==0){
            return
        }
        setDocumentIsLoading(true)
        const showNext10Posts =  async () =>{
            try{
                const resp = await axios.post('https://gateway.scan-interfax.ru/api/v1/documents',{
                    ids: arrayOfDocuments.slice(showedDocuments-10, showedDocuments)
                },
                {
                    headers:{
                        'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
                    }
                })
                let newDocuments = []
                resp.data.forEach((item)=>{
                    newDocuments.push({
                        id: item.ok.id,
                        attributes: item.ok.attributes,
                        title: item.ok.title.text
                    })
                })
                
                setDocuments((prevDocuments)=>[...prevDocuments, ...newDocuments])
                setDocumentIsLoading(false)
                
                if (showedDocuments>=arrayOfDocuments.length) {
                    setCanLoadMore(false)
                }
            } catch (error){

            }
        }
        showNext10Posts()
    }, [showedDocuments])
    const goSearch=()=>{
        props.closeResults()
    }
    const handleLoadMore = ()=>{
        setShowedDocuments((prev)=>prev+loadMoreCount)
    }
    const getSlidesToShow = () => {
        const width = window.innerWidth;
        if (width >= 1300) return 8;
        if (width >= 1100) return 7;
        if (width >= 900) return 6;
        if (width >= 700) return 5;
        return 4;
    };
    const updateButtons = (next) => {
        const slidesToShow = getSlidesToShow();
        if (next===0){
            document.querySelector('.searchpage__results__carousel__leftbtn').classList.add('searchpage__results__carousel__btn__disable')
            document.querySelector('.searchpage__results__carousel__leftbtn').removeEventListener('click',handlePrev)
        }
        else{
            document.querySelector('.searchpage__results__carousel__leftbtn').classList.remove('searchpage__results__carousel__btn__disable')
            document.querySelector('.searchpage__results__carousel__leftbtn').addEventListener('click',handlePrev)
        }
        if (next+slidesToShow>=summaryData.dates.length){
            document.querySelector('.searchpage__results__carousel__rightbtn').classList.add('searchpage__results__carousel__btn__disable')
            document.querySelector('.searchpage__results__carousel__rightbtn').removeEventListener('click',handelNext)
        }
        else{
            document.querySelector('.searchpage__results__carousel__rightbtn').classList.remove('searchpage__results__carousel__btn__disable')
            document.querySelector('.searchpage__results__carousel__rightbtn').addEventListener('click',handelNext)
        }
    }
    const settings = {
        className: "",
        infinite: false,
        swipeToSlide: true,
        speed:500,
        slidesToShow: 8,
        slidesToScroll: 1,
        arrows: false,
        autoplay: false,
        touchThreshold: 100,
        beforeChange: (current, next) => updateButtons(next),
        onInit: ()=>updateButtons(0),
        responsive:[
            {
                breakpoint:1300,
                settings:{
                    slidesToShow: 7
                }
            },
            {
                breakpoint:1100,
                settings:{
                    slidesToShow: 6
                }
            },
            {
                breakpoint:900,
                settings:{
                    slidesToShow: 5
                }
            },{
                breakpoint:700,
                settings:{
                    slidesToShow: 4
                }
            }
        ]
    };
    const SummarySlider = ()=>{
        return (<Slider ref={sliderRef} {...settings}>
            
            {summaryData.dates.map((item, index)=>{
                            return(<div className="searchpage__results__slider__slide" key={index}>
                                <p>{moment(item.date).format('DD.MM.YYYY').toString()}</p>
                                <p>{item.totalDocuments}</p>
                                <p>{item.riskFactors}</p>
                            </div>)
                        })}
                        
        </Slider>)
    }
    const handlePrev = () =>{
        if (sliderRef.current && sliderRef.current.slickPrev){
            sliderRef.current.slickPrev()
        }
    }
    const handelNext = () =>{
        if (sliderRef.current && sliderRef.current.slickNext) {
            sliderRef.current.slickNext()
        }
    }
    return (
        <>
            <div className='searchpage__results__updiv'>
                <div className='searchpage__results__updiv__text'>
                    <p>Ищем. Скоро <br></br>будут результаты</p>
                    <p>Поиск может занять некоторое время, <br></br>просим сохранять терпение.</p>
                </div>
                <SvgSearchResults/>
            </div>
            {error==500?"Ошибка!":<></>}
            <div className='searchpage__results__summary'>
                <h2>Общая сводка</h2>
                <h4>Найдено {(summaryIsLoading||documentsIsLoading)? "... ":summaryData.allcount} вариантов</h4>
            </div>
            <div className="searchpage__results__carousel">
                <img
                    className={`searchpage__results__carousel__leftbtn searchpage__results__carousel__btn__disable`}
                    src={btnprev} 
                />
                <div className="searchpage__results__slider">
                    <div className="searchpage__results__slider__info">
                        <p>Период</p>
                        <p>Всего</p>
                        <p>Риски</p>
                    </div>
                    {(summaryIsLoading||documentsIsLoading)?<></>:
                    <div className="searchpage__results__slider__slides">
                        <SummarySlider></SummarySlider>
                    </div>}
                        
                </div>
                <img 
                    className={`searchpage__results__carousel__rightbtn searchpage__results__carousel__btn__disable`}
                    src={btnprev}>  
                </img>
            </div>
            <>
                
                    {documents?
                        documents.map((item, index)=>{
                            return  <Document key={item.id} data={item} index={index+1}></Document>
                        })
                    :
                        <></>
                    }
                
                {documents.length==0?
                    <>
                        
                    </>
                :
                    <>{canLoadMore?
                        <button onClick={handleLoadMore} disabled={documentsIsLoading}>{documentsIsLoading?"Загрузка...":"Загрузить еще документы"}</button>
                        :
                        <p>Больше нечего загружать!</p>
                    }</>
                }
                
            </>
            <button onClick={goSearch}>Вернуться</button>   
            
        </>
    );
}

export default SearchResults;