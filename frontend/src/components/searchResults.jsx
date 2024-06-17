import React, { useState, useEffect } from 'react';
import axios from 'axios';

function SearchResults(props) {
    const [data, setData] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [summaryIsLoading, setSummaryIsLoading] = useState(true);
    const [documentsIsLoading, setDocumentIsLoading] = useState(true)

    useEffect(() => {
        const fetchCount = async() =>{
            setDocumentIsLoading(true)
            try{
                const resp = await axios.post('http://localhost:3000/objectsearch', {
                    inn: props.formData.inn,
                    tone: props.formData.tone,
                    documentCount: props.formData.documentCount,
                    startDate: props.formData.startDate,
                    endDate: props.formData.endDate,
                    maxCompleteness: props.formData.maxCompleteness,
                    businessContext: props.formData.businessContext,
                    mainRole: props.formData.mainRole,
                    riskFactors: props.formData.riskFactors,
                    technicalNews: props.formData.technicalNews,
                    announcements: props.formData.announcements,
                    newsSummary: props.formData.newsSummary,
                });
                setDocumentIsLoading(false)
                console.log(new Date())
            }
            catch (error){
                console.error('Ошибка: ', error);
            }
        }
        const fetchSummaryData = async () => {
            setSummaryIsLoading(true);
            try {
                const resp = await axios.post('http://localhost:3000/objectsearch/histograms', {
                    inn: props.formData.inn,
                    tone: props.formData.tone,
                    documentCount: props.formData.documentCount,
                    startDate: props.formData.startDate,
                    endDate: props.formData.endDate,
                    maxCompleteness: props.formData.maxCompleteness,
                    businessContext: props.formData.businessContext,
                    mainRole: props.formData.mainRole,
                    riskFactors: props.formData.riskFactors,
                    technicalNews: props.formData.technicalNews,
                    announcements: props.formData.announcements,
                    newsSummary: props.formData.newsSummary,
                });
                setData(resp.data);
                setSummaryIsLoading(false);
                console.log(resp.data)
            } catch (error) {
                console.error('Ошибка: ', error);
            }
        };
        fetchCount()
        fetchSummaryData()

    }, []);

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex < data.dates.length - 4 ? prevIndex + 1 : prevIndex));
    };

    const visibleData = data.dates && data.dates.slice(currentIndex, currentIndex + 4);
    const goSearch=()=>{
        props.closeResults()
    }
    return (
        <>
            {summaryIsLoading ? (
                <p>Загрузка...</p>
            ) : (
                <div>
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
                                        <td>{item.date}</td>
                                        <td>{item.count}</td>
                                        <td>{item.risks}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleNext} disabled={currentIndex === data.dates.length - 4 ||  data.dates.length<4}>
                            {'>'}
                        </button>
                    </div>
                    <button onClick={goSearch}>Вернуться</button>
                </div>
            )}
            {documentsIsLoading?
                <p>Загрузка документов...</p>
            :
                <p>Загрузка завершена</p>
            }
        </>
    );
}

export default SearchResults;