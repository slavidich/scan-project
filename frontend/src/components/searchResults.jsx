import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Document from './document.jsx';

function SearchResults(props) {
    const [data, setData] = useState(0);
    const [summaryIsLoading, setSummaryIsLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [error, setError] = useState(false)
    const [firstLoadingDocuments, setFirstLoadingDocuments] = useState(true)
    const [arrayOfDocuments, setArrayOfDocuments] = useState([])
    const [documentsIsLoading, setDocumentIsLoading] = useState(true)
    const [showedDocuments, setShowedDocuments] = useState(0)
    const [documents, setDocuments] = useState([])
    const [canLoadMore, setCanLoadMore] = useState(true)

    const summaryInRow = 8

    useEffect(() => {
        const requestBody = {
            intervalType: "month",
            histogramTypes: [
                "totalDocuments",
                "riskFactors"
            ],
            issueDateInterval:{
                startDate: `${props.formData.startDate}T00:00:00+03:00`,
                endDate: `${props.formData.endDate}T23:59:00+03:00`
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
                if (sum===0) setError(400)
                setData({
                    allcount: sum,
                    dates: combinedData
                })
                setSummaryIsLoading(false)
            } catch (error) {
                setError(500)
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
                setShowedDocuments((prev)=>prev+10)
            }
            catch (error){
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
                console.log(newDocuments)
                setDocuments((prevDocuments)=>[...prevDocuments, ...newDocuments])
                setDocumentIsLoading(false)
                if (firstLoadingDocuments) setFirstLoadingDocuments(false)
                if (showedDocuments>=arrayOfDocuments.length) {
                    setCanLoadMore(false)
                }
            } catch (error){

            }
        }
        showNext10Posts()
    }, [showedDocuments])
    
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < data.dates.length - summaryInRow ? prevIndex + 1 : prevIndex));
    };

    const visibleData = data.dates && data.dates.slice(currentIndex, currentIndex + summaryInRow);
    const goSearch=()=>{
        props.closeResults()
    }
    const handleLoadMore = ()=>{

        setShowedDocuments((prev)=>prev+10)
    }
    if (error===500){
        return (<h1>Ошибка сервера!</h1>)
    }
    if (error===400){
        return (<h1>Запрос не выдал результатов!</h1>)
    }
    return (
        <>
            {summaryIsLoading ? (<p>Загрузка...</p>) 
            : 
            (<div>
                <h2>Общая сводка</h2>
                <h4>Всего: {data.allcount}</h4>
                <div>
                    <button onClick={handlePrev} disabled={currentIndex === 0}>
                        {'<'}
                    </button>
                    <table>
                        <thead>
                            <tr>
                                <th>Период</th>
                                <th>Всего</th>
                                <th>Риски</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.date.toLocaleDateString()}</td>
                                    <td>{item.totalDocuments}</td>
                                    <td>{item.riskFactors}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button onClick={handleNext} disabled={currentIndex === data.dates.length - summaryInRow ||  data.dates.length<summaryInRow}>
                        {'>'}
                    </button>
                </div>
                <button onClick={goSearch}>Вернуться</button>
            </div>)}
            

            {firstLoadingDocuments?
                    <p>Первичная загрузка документов</p>
                :
                    
                    <>
                    {documents?
                        documents.map((item, index)=>{
                            console.log(item, 123)
                            return  <Document key={item.id} data={item} index={index+1}></Document>
                        })
                    :
                        <></>
                    }
                    {canLoadMore?
                        <button onClick={handleLoadMore} disabled={documentsIsLoading}>{documentsIsLoading?"Загрузка...":"Загрузить еще документы"}</button>
                        :
                        <p>Больше нечего загружать!</p>
                    }
                    </>
            }
        </>
    );
}

export default SearchResults;