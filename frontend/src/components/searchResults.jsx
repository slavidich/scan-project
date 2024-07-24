import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Document from './document.jsx';
import moment from 'moment';

function SearchResults(props) {
    const [summaryData, setSummaryData] = useState(0);
    const [summaryIsLoading, setSummaryIsLoading] = useState(true);

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

    return (
        <>
            {error==500?"Ошибка!":<></>}
            <div>
                <h2>Общая сводка</h2>
                <h4>Всего: {(summaryIsLoading||documentsIsLoading)? "Загрузка общой сводки":summaryData.allcount}</h4>
                <button onClick={goSearch}>Вернуться</button>
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
            
        </>
    );
}

export default SearchResults;